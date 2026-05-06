import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        await dbConnect();

       
        const { searchParams } = new URL(req.url);
        const token = searchParams.get("token");

        if (!token) {
            return NextResponse.json({ message: "Token is missing" }, { status: 400 });
        }

      
        const user = await User.findOne({ verificationToken: token });

        if (!user) {
            return NextResponse.json(
                { message: "Invalid token or account already verified" }, 
                { status: 400 }
            );
        }

       
        user.isVerified = true;
        user.verificationToken = undefined; 
        await user.save();

      
        return NextResponse.redirect(new URL("/login?verified=true", req.url));

    } catch (error) {
        console.error("Verification Error:", error);
        return NextResponse.json(
            { message: "Internal Server Error", error: error.message }, 
            { status: 500 }
        );
    }
}