import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route"; 

export async function PUT(req) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // بنقرأ الداتا مرة واحدة فقط ✅
    const { name, phone, address, image } = await req.json();

    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      { 
        name, 
        phone, 
        address, // هيتخزن كـ Object (street, city, etc.)
        image    // هيتحفظ في الداتابيز بس مش هينزل في السيشين عشان الـ 431 Error
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Profile updated successfully",
      user: {
        name: updatedUser.name,
        phone: updatedUser.phone,
        address: updatedUser.address
      },
    });
  } catch (error) {
    console.error("Update Error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}