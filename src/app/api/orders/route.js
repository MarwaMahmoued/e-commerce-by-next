import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";
import Product from "@/models/Products"; 
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { sendOrderEmail } from "@/utils/helper"; 


export async function POST(req) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ message: "Unauthorized! Please login first." }, { status: 401 });
        }

        const body = await req.json();

     
        for (const item of body.orderItems) {
            const product = await Product.findById(item.product);
            
            if (!product) {
                return NextResponse.json({ message: `Product ${item.name} not found.` }, { status: 404 });
            }

            if (product.stock < item.quantity) {
                return NextResponse.json({ 
                    message: `Sorry, only ${product.stock} units of ${product.name} are available.` 
                }, { status: 400 });
            }
        }

   
        const itemsWithSeller = await Promise.all(body.orderItems.map(async (item) => {
            const productData = await Product.findById(item.product);
            return {
                ...item,
                seller: productData.seller 
            };
        }));

        const orderData = {
            ...body,
            orderItems: itemsWithSeller,
            user: session.user.id
        };

    
        
        const order = await Order.create(orderData);

      
        
        for (const item of itemsWithSeller) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { stock: -item.quantity }
            });
        }

       
        try {
            await sendOrderEmail(session.user.email, order, "Order Created Successfully");
        } catch (emailErr) {
            console.error("Confirmation Email Error:", emailErr);
        }

        return NextResponse.json({ message: "Order created successfully", order }, { status: 201 });
    } catch (error) {
        console.error("POST Order Error:", error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}


export async function GET(req) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ message: "Unauthorized! Please login." }, { status: 401 });
        }

        let orders;

        if (session.user.role === "admin") {
            const rawOrders = await Order.find({})
                .populate("user", "name email")
                .populate("orderItems.product")
                .sort({ createdAt: -1 });

            orders = rawOrders.map(order => {
                const orderObj = order.toObject();
                orderObj.totalPrice = orderObj.orderItems.reduce((acc, item) => {
                    return acc + (Number(item.price || 0) * Number(item.quantity || 0));
                }, 0);
                return orderObj;
            });
        }
        else if (session.user.role === "seller") {
            const rawOrders = await Order.find({ "orderItems.seller": session.user.id })
                .populate("user", "name email")
                .populate("orderItems.product")
                .sort({ createdAt: -1 });

            orders = rawOrders.map(order => {
                const orderObj = order.toObject();
                orderObj.orderItems = orderObj.orderItems.filter(item =>
                    item.seller && item.seller.toString() === session.user.id.toString()
                );
                orderObj.totalPrice = orderObj.orderItems.reduce((acc, item) => {
                    return acc + (Number(item.price || 0) * Number(item.quantity || 0));
                }, 0);
                return orderObj;
            });
        }
        else {
            orders = await Order.find({ user: session.user.id })
                .populate("user", "name email")
                .populate("orderItems.product")
                .sort({ createdAt: -1 });
        }

        return NextResponse.json(orders, { status: 200 });
    } catch (error) {
        console.error("GET Orders Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}


export async function PUT(req) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);

        if (!session || (session.user.role !== "admin" && session.user.role !== "seller")) {
            return NextResponse.json({ message: "Forbidden!" }, { status: 403 });
        }

        const { orderId, newStatus } = await req.json();

        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { orderStatus: newStatus },
            { new: true, runValidators: true }
        ).populate("user", "email name");

        if (!updatedOrder) {
            return NextResponse.json({ message: "Order not found" }, { status: 404 });
        }

        try {
            await sendOrderEmail(updatedOrder.user.email, updatedOrder, newStatus);
        } catch (emailErr) {
            console.error("Tracking Email Error:", emailErr);
        }

        return NextResponse.json({ message: "Order status updated successfully", updatedOrder }, { status: 200 });
    } catch (error) {
        console.error("PUT Order Error:", error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}