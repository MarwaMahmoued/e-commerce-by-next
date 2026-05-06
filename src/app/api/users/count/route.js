import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await dbConnect();
        const count = await User.countDocuments();
        return NextResponse.json({ count });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}