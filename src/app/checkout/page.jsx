"use client";

import { useCart } from "@/context/CartContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";

export default function CheckoutPage() {
    const { cart, totalPrice: contextTotalPrice, clearCart } = useCart();
    const router = useRouter();
    const { data: session, status } = useSession();

    const [address, setAddress] = useState({ address: "", city: "", phone: "" });
    const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
    const [loading, setLoading] = useState(false);
    const [finalOrderPrice, setFinalOrderPrice] = useState(0);

  
    useEffect(() => {
        const savedPrice = localStorage.getItem("finalPrice");
        if (savedPrice) {
            setFinalOrderPrice(Number(savedPrice));
        } else {
            setFinalOrderPrice(contextTotalPrice);
        }
    }, [contextTotalPrice]);

    const handlePlaceOrder = async (e) => {
        e.preventDefault();

       
        if (status !== "authenticated") {
            toast.error("Please login first to complete your order");
            router.push("/login");
            return;
        }

        setLoading(true);

        
        const orderItems = cart.map(item => ({
            name: item.name,
            quantity: item.quantity || 1,
            image: item.images?.[0] || item.image,
            price: item.price,
            product: item._id,
        }));

       
        if (paymentMethod === "Stripe") {
            try {
             
                const tempOrder = {
                    orderItems,
                    shippingAddress: address,
                    paymentMethod: "Stripe",
                    itemsPrice: finalOrderPrice,
                    taxPrice: 0,
                    shippingPrice: 0,
                    totalPrice: finalOrderPrice,
                };
                localStorage.setItem("pendingOrder", JSON.stringify(tempOrder));

                const response = await fetch("/api/checkout", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ cartItems: orderItems }),
                });

                const data = await response.json();

                if (data.url) {
                
                    window.location.href = data.url;
                } else {
                    toast.error(data.error || "Failed to create Stripe session");
                    setLoading(false);
                }
            } catch (error) {
                console.error("Stripe Connection Error:", error);
                toast.error("Connection to Stripe failed");
                setLoading(false);
            }
            return; 
        }

      
        const orderData = {
            orderItems,
            shippingAddress: address,
            paymentMethod: paymentMethod,
            itemsPrice: finalOrderPrice,
            taxPrice: 10, 
            shippingPrice: 0, 
            totalPrice: finalOrderPrice,
        };

        try {
            const res = await fetch("/api/orders", { 
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(orderData)
            });

            const data = await res.json();

            if (res.ok) {
                toast.success("Order placed successfully! 🎉");
                localStorage.removeItem("finalPrice");
                clearCart();
                router.push("/success");
            } else {
                toast.error(`Error: ${data.message || data.error}`);
            }
        } catch (error) {
            toast.error("Connection to server failed");
        } finally {
            setLoading(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6">
                <h2 className="text-2xl font-bold text-gray-800">Your cart is empty </h2>
                <button 
                    onClick={() => router.push("/products")} 
                    className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-gray-900 transition-all"
                >
                    Back to Shopping
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-10 font-sans" dir="ltr">
            <h1 className="text-3xl font-black mb-8 text-gray-900">Checkout 🛒</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                
                {/* Shipping Form */}
                <form onSubmit={handlePlaceOrder} className="space-y-4 bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-50">
                    <h2 className="font-bold text-xl mb-4 text-gray-700">Shipping Address</h2>
                    <input 
                        type="text" placeholder="Full Address" required
                        className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => setAddress({...address, address: e.target.value})}
                    />
                    <input 
                        type="text" placeholder="City" required
                        className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => setAddress({...address, city: e.target.value})}
                    />
                    <input 
                        type="text" placeholder="Phone Number" required
                        className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => setAddress({...address, phone: e.target.value})}
                    />

                    <div className="mt-6">
                        <h2 className="font-bold text-xl mb-4 text-gray-700">Payment Method</h2>
                        <div className="space-y-3">
                            <label className={`flex items-center justify-between p-4 border-2 rounded-2xl cursor-pointer transition-all ${paymentMethod === 'Cash on Delivery' ? 'border-blue-600 bg-blue-50' : 'border-gray-100 opacity-70'}`}>
                                <input 
                                    type="radio" name="payment" value="Cash on Delivery"
                                    checked={paymentMethod === 'Cash on Delivery'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="hidden"
                                />
                                <span className="font-bold text-gray-700 text-sm">Cash on Delivery</span>
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'Cash on Delivery' ? 'border-blue-600' : 'border-gray-300'}`}>
                                    {paymentMethod === 'Cash on Delivery' && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full"></div>}
                                </div>
                            </label>

                            <label className={`flex items-center justify-between p-4 border-2 rounded-2xl cursor-pointer transition-all ${paymentMethod === 'Stripe' ? 'border-blue-600 bg-blue-50' : 'border-gray-100 opacity-70'}`}>
                                <input 
                                    type="radio" name="payment" value="Stripe"
                                    checked={paymentMethod === 'Stripe'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="hidden"
                                />
                                <span className="font-bold text-gray-700 text-sm">Credit Card (Stripe) 💳</span>
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'Stripe' ? 'border-blue-600' : 'border-gray-300'}`}>
                                    {paymentMethod === 'Stripe' && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full"></div>}
                                </div>
                            </label>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className={`w-full mt-4 ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-gray-900'} text-white p-5 rounded-2xl font-black text-lg transition-all`}
                    >
                        {loading ? "Processing..." : `Place Order ($${finalOrderPrice.toFixed(2)})`}
                    </button>
                </form>

                {/* Order Summary */}
                <div className="bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100">
                    <h2 className="font-bold text-xl mb-6 text-gray-700">Order Summary</h2>
                    <div className="space-y-4 max-h-80 overflow-y-auto px-2">
                        {cart.map(item => (
                            <div key={item._id} className="flex justify-between items-center bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                                <div className="flex items-center gap-3">
                                    <img src={item.images?.[0] || item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                                    <span className="font-medium text-gray-600 text-sm">{item.name} (x{item.quantity || 1})</span>
                                </div>
                                <span className="font-black text-blue-600">${(item.price * (item.quantity || 1)).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                    <div className="border-t border-dashed border-gray-300 mt-6 pt-6 flex justify-between font-black text-2xl text-gray-900">
                        <span>Total:</span>
                        <span className="text-blue-600">${finalOrderPrice.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}