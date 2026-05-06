import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "../auth/[...nextauth]/route"; 

export async function POST(req) {
    try {
        await dbConnect();
      
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ error: "Please log in first" }, { status: 401 });
        }

        const { productId } = await req.json();
        if (!productId) {
            return NextResponse.json({ error: "Product not found" }, { status: 400 });
        }

      
        const user = await User.findOne({ email: session.user.email });
        
        if (!user) {
            return NextResponse.json({ error: "User not found in the database" }, { status: 404 });
        }

      
        if (!user.wishlist) {
            user.wishlist = [];
        }

        
        const isExist = user.wishlist.includes(productId);
        
        if (isExist) {
            user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
        } else {
            user.wishlist.push(productId);
        }

        await user.save();
        
        return NextResponse.json({ 
            message: isExist ? "item removed from wishlist 💔" : "item added to wishlist ❤️", 
            wishlist: user.wishlist 
        });

    } catch (error) {
        console.error("Wishlist API Error:", error);
        return NextResponse.json({ error: "There was an error with the server: " + error.message }, { status: 500 });
    }
}