import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { NextResponse } from "next/server";
import { sendWelcomeEmail } from "@/lib/emailService"; 

export async function POST(req) {
    try {
        await dbConnect();

        const { name, email, password, phone } = await req.json();

        
        const userExists = await User.findOne({ email });
        if (userExists) {
            return NextResponse.json(
                { message: "This email is already registered." }, 
                { status: 400 }
            );
        }

     
        const hashedPassword = await bcrypt.hash(password, 10);

       
        const verificationToken = crypto.randomBytes(32).toString("hex");

   
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            role: "customer", 
            verificationToken, 
            phone
        });

     
        await sendWelcomeEmail(newUser.email, newUser.name, verificationToken);

        return NextResponse.json(
            { message: "Account created successfully! 🎉 Check your email to verify your account.", user: newUser }, 
            { status: 201 }
        );

    } catch (error) {
        console.error("Registration Error:", error);
        return NextResponse.json(
            { message: "Internal Server Error", error: error.message }, 
            { status: 500 }
        );
    }
}