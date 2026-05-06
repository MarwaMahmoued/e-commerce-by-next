import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(req) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: "you must be logged in" }, { status: 401 });
        }

        const { cartItems } = await req.json(); 

        const formattedCart = cartItems.map(item => ({
            productId: item._id,
            quantity: item.quantity || 1
        }));

        const user = await User.findOneAndUpdate(
            { email: session.user.email },
            { cart: formattedCart },
            { new: true }
        );

        return NextResponse.json({ message: "Cart updated successfully", cart: user.cart });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}