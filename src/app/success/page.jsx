"use client";
import { useEffect, useRef } from "react";
import { useCart } from "@/context/CartContext";
import Link from "next/link";

export default function SuccessPage() {
    const { clearCart } = useCart();
    const hasSaved = useRef(false); 

    useEffect(() => {
        const saveOrderToDB = async () => {
            const pendingOrder = localStorage.getItem("pendingOrder");
            
            if (pendingOrder && !hasSaved.current) {
                hasSaved.current = true; 
                const orderData = JSON.parse(pendingOrder);

                try {
                    const res = await fetch("/api/orders", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ ...orderData, isPaid: true }),
                    });

                    if (res.ok) {
                        localStorage.removeItem("pendingOrder");
                        localStorage.removeItem("finalPrice");
                        clearCart();
                    }
                } catch (error) {
                    console.error("Error saving order:", error);
                }
            }
        };

        saveOrderToDB();
    }, [clearCart]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
            <div className="bg-green-100 p-6 rounded-full mb-6">
                <span className="text-6xl">🎉</span>
            </div>
            <h1 className="text-4xl font-black text-gray-900 mb-4">Order Placed Successfully!</h1>
            <p className="text-gray-500 text-lg mb-8">
                Thank you for your trust. Your order has been recorded.
            </p>
            <Link href="/" className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold">
                Back to Shopping 🛒
            </Link>
        </div>
    );
}