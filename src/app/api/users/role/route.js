import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route"; 

export async function PATCH(req) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    // 1. التأكد من تسجيل الدخول
    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // 2. التأكد أن الشخص الذي يقوم بالتعديل هو Admin أصلاً
    if (session.user.role !== "admin") {
        return NextResponse.json({ message: "Forbidden: Admins only" }, { status: 403 });
    }

    const { userId, newRole } = await req.json();

    // 3. التأكد من وجود البيانات المطلوبة
    if (!userId || !newRole) {
        return NextResponse.json({ message: "Missing userId or newRole" }, { status: 400 });
    }

    // 4. التحديث في قاعدة البيانات
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role: newRole },
      { new: true, runValidators: true } // runValidators عشان يتأكد إن الـ role ضمن الاختيارات المتاحة
    );

    if (!updatedUser) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ 
        message: "Role Updated Successfully! ✅", 
        role: updatedUser.role 
    });

  } catch (error) {
    console.error("Update Role Error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}