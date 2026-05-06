import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import Product from "@/models/Products"; 
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(req) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: "Please log in first" }, { status: 401 });
        }

        
        const user = await User.findOne({ email: session.user.email }).populate("wishlist");

        return NextResponse.json({ wishlist: user.wishlist || [] });
    } catch (error) {
        return NextResponse.json({ error: "There was an error with the server: " + error.message }, { status: 500 });
    }
}