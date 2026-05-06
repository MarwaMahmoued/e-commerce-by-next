import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

// GET Method: Fetch users and role statistics
export async function GET() {
  try {
    await dbConnect();
    
    // 1. Fetch all users from database
    const users = await User.find({}).sort({ createdAt: -1 });

    // 2. Calculate statistics for the Dashboard Cards
    const stats = {
      total: users.length,
      customers: users.filter(u => u.role === "customer").length,
      sellers: users.filter(u => u.role === "seller").length,
      admins: users.filter(u => u.role === "admin").length
    };

    return NextResponse.json({ 
      success: true,
      users, 
      stats 
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ 
      success: false,
      message: "Failed to fetch users data" 
    }, { status: 500 });
  }
}

// DELETE Method: Remove a user by ID
export async function DELETE(req) {
  try {
    await dbConnect();
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ 
        success: false,
        message: "User ID is required" 
      }, { status: 400 });
    }

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return NextResponse.json({ 
        success: false,
        message: "User not found" 
      }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true,
      message: "User deleted successfully" 
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ 
      success: false,
      message: "Internal server error during deletion" 
    }, { status: 500 });
  }
}