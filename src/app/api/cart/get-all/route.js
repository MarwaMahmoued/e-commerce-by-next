import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import Product from "../../../../models/Products";

export async function GET() {
    try {
        await dbConnect();
        
     
        const modelCheck = Product; 

        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: "you must be logged in" }, { status: 401 });
        }

     
        const user = await User.findOne({ email: session.user.email }).populate("cart.productId");

        if (!user || !user.cart) {
            return NextResponse.json({ cart: [] });
        }

    
        const formattedCart = user.cart
            .filter(item => item.productId !== null) 
            .map(item => ({
                ...item.productId._doc,
                quantity: item.quantity
            }));

        return NextResponse.json({ cart: formattedCart });
    } catch (error) {
        console.error("Cart GET Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}