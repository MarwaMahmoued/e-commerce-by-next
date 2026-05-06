
import { NextResponse } from "next/server";
import Order from "@/models/Order";
import dbConnect from "@/lib/dbConnect";

export async function PUT(req, { params }) {
    try {
        await dbConnect();
        
        
        const { id } = await params; 
        
        const { orderStatus } = await req.json();

       
        const updatedOrder = await Order.findByIdAndUpdate(
            id,
            { orderStatus },
            { 
                returnDocument: 'after', 
                runValidators: true 
            }
        );

        if (!updatedOrder) {
            return NextResponse.json({ message: "Order not found" }, { status: 404 });
        }

        return NextResponse.json(updatedOrder, { status: 200 });
    } catch (error) {
        console.error("Order Update Error:", error);
        return NextResponse.json(
            { message: "Update failed", error: error.message }, 
            { status: 500 }
        );
    }
}


export async function GET(req, { params }) {
    try {
        await dbConnect ();
        
      
        const { id } = await params;

        const order = await Order.findById(id).populate("user", "name email");

        if (!order) {
            return NextResponse.json({ message: "Order not found" }, { status: 404 });
        }

        return NextResponse.json(order, { status: 200 });
    } catch (error) {
        console.error("Order Fetch Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}