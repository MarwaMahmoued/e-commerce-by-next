import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route"; 

export async function PATCH(req) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

   
    if (!session) {
        return NextResponse.json({ message: "Please login first" }, { status: 401 });
    }

  
    const userId = session.user.id; 

   
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role: "seller" },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ 
        success: true,
        message: "Congratulations! You are now a Seller 🚀", 
        role: updatedUser.role 
    });

  } catch (error) {
    console.error("Become Seller Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}