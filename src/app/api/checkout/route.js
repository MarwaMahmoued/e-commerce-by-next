import { NextResponse } from "next/server";
import Stripe from "stripe";


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const { cartItems } = await req.json();

  
    const line_items = cartItems.map((item) => {
   
      let imageUrl = item.image;
      
      if (imageUrl && typeof imageUrl === 'string') {
     
        imageUrl = encodeURI(imageUrl);
        
     
        if (!imageUrl.startsWith('http')) {
           imageUrl = "https://via.placeholder.com/150"; 
        }
      } else {
        imageUrl = "https://via.placeholder.com/150";
      }

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
            images: [imageUrl], 
          },
          unit_amount: Math.round(item.price * 100), 
        },
        quantity: item.quantity,
      };
    });

  
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,
    });


    return NextResponse.json({ url: session.url });

  } catch (err) {
    console.error("Stripe Error Details:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}