import dbConnect from "@/lib/dbConnect.js";
import Product from "@/models/Products"; 
import { NextResponse } from "next/server"; 


export async function GET(req) {
    try {
        await dbConnect();

        const { searchParams } = new URL(req.url);
        const keyword = searchParams.get("keyword");
        const category = searchParams.get("category");
        const maxPrice = searchParams.get("maxPrice");
        const sellerId = searchParams.get("seller"); 

        let query = {};

        if (sellerId && sellerId !== "") {
            query.seller = sellerId; 
        }

        if (keyword && keyword !== "") {
            query.name = { $regex: keyword, $options: "i" };
        }

        if (category && category !== "All") {
            query.category = category;
        }

        if (maxPrice && maxPrice !== "") {
            query.price = { $lte: Number(maxPrice) };
        }

        const products = await Product.find(query).sort({ createdAt: -1 });
        
        return NextResponse.json(products, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Error", error: error.message }, { status: 500 });
    }
}


export async function POST(req) {
    try {
        await dbConnect();
        const body = await req.json();

        
        const newProduct = await Product.create(body);

        return NextResponse.json({ success: true, data: newProduct }, { status: 201 });
    } catch (error) {
        console.error("Post Error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to add product", error: error.message }, 
            { status: 400 }
        );
    }
}