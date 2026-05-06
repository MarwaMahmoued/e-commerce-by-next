import dbConnect from "@/lib/dbConnect";
import Product from "../../../../../models/Products"; 
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../api/auth/[...nextauth]/route";

export async function POST(req, { params }) {
  try {
    await dbConnect();
    

    const { id } = await params; 
    
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "you must be logged in to add a review" }, { status: 401 });
    }

    const { rating, comment } = await req.json();


    const product = await Product.findById(id);

    if (product) {
    
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === session.user.id.toString()
      );

      if (alreadyReviewed) {
        return NextResponse.json({ error:" you have already reviewed this product" }, { status: 400 });
      }

  
      const review = {
        name: session.user.name,
        rating: Number(rating),
        comment,
        user: session.user.id,
      };

      
      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      
   
      product.rating = 
        product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

      await product.save();
      return NextResponse.json({ message: "you have successfully reviewed this product" }, { status: 201 });
    } else {
      return NextResponse.json({ error: "product not found" }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}