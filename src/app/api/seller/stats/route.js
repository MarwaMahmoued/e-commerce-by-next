import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Products";
import Order from "@/models/Order";
import mongoose from "mongoose"; 

export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const sellerId = searchParams.get("sellerId");

    if (!sellerId) {
      return NextResponse.json({ message: "Seller ID is required" }, { status: 400 });
    }

    
    const sellerObjectId = new mongoose.Types.ObjectId(sellerId);

  
    const totalProducts = await Product.countDocuments({ seller: sellerId });


    const stats = await Order.aggregate([
    
      { $unwind: "$orderItems" },
      { $match: { "orderItems.seller": sellerObjectId } },
      
      { 
        $group: {
          _id: null,
          totalSales: { $sum: { $multiply: ["$orderItems.price", "$orderItems.quantity"] } },
      
          allProductsSales: { 
            $push: { 
              name: "$orderItems.name", 
              quantity: "$orderItems.quantity" 
            } 
          }
        }
      }
    ]);

  
    const activeOrdersCount = await Order.countDocuments({
      "orderItems.seller": sellerId,
      orderStatus: { $ne: "Delivered" }
    });

 
    let topProduct = { name: "No Sales Yet", sales: 0 };
    if (stats.length > 0 && stats[0].allProductsSales.length > 0) {
    
      const salesMap = {};
      stats[0].allProductsSales.forEach(item => {
        salesMap[item.name] = (salesMap[item.name] || 0) + item.quantity;
      });
      
      const topEntry = Object.entries(salesMap).reduce((a, b) => a[1] > b[1] ? a : b);
      topProduct = { name: topEntry[0], sales: topEntry[1] };
    }

    return NextResponse.json({
      totalProducts,
      totalSales: stats[0]?.totalSales.toFixed(2) || "0.00",
      activeOrders: activeOrdersCount,
      topProduct 
    }, { status: 200 });

  } catch (error) {
    console.error("Stats Error:", error);
    return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
  }
}