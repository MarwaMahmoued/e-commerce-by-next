import dbConnect from "@/lib/dbConnect.js";
import Product from "@/models/Products";
import { NextResponse } from "next/server";


export async function GET(req, { params }) {
    try {
        await dbConnect();
        
      
        const resolvedParams = await params;
        const id = resolvedParams.id;

        const product = await Product.findById(id);
        
        if (!product) return NextResponse.json({ message: "Product not found" }, { status: 404 });
        return NextResponse.json(product, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}


export async function PATCH(req, { params }) {
    try {
        await dbConnect();
        
      
        const resolvedParams = await params;
        const id = resolvedParams.id;
        
        const body = await req.json();
        const updatedProduct = await Product.findByIdAndUpdate(id, body, { new: true });
        
        if (!updatedProduct) return NextResponse.json({ message: "Product not found" }, { status: 404 });
        return NextResponse.json(updatedProduct, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}


export async function DELETE(req, { params }) {
    try {
        await dbConnect();
        
      
        const resolvedParams = await params;
        const id = resolvedParams.id;

        const deletedProduct = await Product.findByIdAndDelete(id);
        
        if (!deletedProduct) return NextResponse.json({ message: "Product not found" }, { status: 404 });
        return NextResponse.json({ message: "Product Deleted Successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}