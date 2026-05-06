import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await dbConnect(); 
        return NextResponse.json({ 
            success: true, 
            message: "Database is connected successfully!" 
        });
    } catch (error) {
        return NextResponse.json({ 
            success: false, 
            message: " Connection failed", 
            error: error.message 
        }, { status: 500 });
    }
}