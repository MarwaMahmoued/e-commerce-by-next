"use client";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function CartPage() {
  const { cart, removeFromCart, clearCart, updateQuantity, totalPrice } = useCart();
  const router = useRouter();
  
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0); 


  const subTotal = totalPrice;
  const discountValue = subTotal * discount;
  const finalTotal = subTotal - discountValue;

  const applyPromoCode = () => {
    if (promoCode.trim().toUpperCase() === "ITI2026") {
      setDiscount(0.1); 
      toast.success("Promo code applied! 10% discount added.");
    } else {
      setDiscount(0);
      toast.error("Invalid promo code. Try ITI2026");
    }
  };

  const handleCheckout = () => {
   
    localStorage.setItem("finalPrice", finalTotal);
    router.push("/checkout");
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4 font-sans">
        <div className="text-6xl animate-bounce">🛒</div>
        <h2 className="text-2xl font-bold text-gray-800">Your cart is empty</h2>
        <Link href="/products" className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-blue-700 transition-all">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 font-sans" dir="ltr">
      <h1 className="text-3xl font-black text-gray-900 mb-10">Shopping Cart 🛍️</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
          {cart.map((item) => (
            <div key={item._id} className="flex flex-wrap md:flex-nowrap items-center bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all">
              <img 
                src={item.images?.[0] || "/placeholder.png"} 
                className="w-24 h-24 object-cover rounded-2xl shadow-inner" 
                alt={item.name} 
              />
              
              <div className="ml-6 flex-grow mt-4 md:mt-0">
                <h3 className="font-bold text-gray-800 text-lg">{item.name}</h3>
                <p className="text-blue-600 font-black text-xl mt-1">${item.price}</p>
              </div>

              {/* Quantity Control */}
              <div className="flex items-center bg-gray-50 p-2 rounded-2xl mx-4">
                <button 
                  onClick={() => updateQuantity(item._id, (item.quantity || 1) + 1)}
                  className="w-8 h-8 bg-white rounded-xl shadow-sm font-bold text-blue-600 hover:bg-blue-600 hover:text-white transition-all"
                >+</button>
                
                <span className="mx-4 font-bold text-gray-700">{item.quantity || 1}</span>
                
                <button 
                  onClick={() => updateQuantity(item._id, (item.quantity || 1) - 1)}
                  className="w-8 h-8 bg-white rounded-xl shadow-sm font-bold text-gray-400 hover:bg-red-500 hover:text-white transition-all"
                >-</button>
              </div>

              <button 
                onClick={() => removeFromCart(item._id)}
                className="p-3 text-red-200 hover:text-red-500 transition-colors"
              >
                🗑️
              </button>
            </div>
          ))}
          
          <button 
            onClick={clearCart}
            className="text-sm text-gray-400 hover:text-red-500 ml-4 font-bold"
          >
            Clear All Cart
          </button>
        </div>

        {/* Order Summary */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl h-fit sticky top-24">
          <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">Order Summary</h2>
          
          {/* Promo Code */}
          <div className="mb-6">
             <label className="text-[10px] font-bold text-gray-400 block mb-2 uppercase">Promo Code</label>
             <div className="flex gap-2">
                <input 
                  type="text" 
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Enter code" 
                  className="bg-gray-50 border-none rounded-xl px-4 py-2 text-sm w-full focus:ring-2 focus:ring-blue-100" 
                />
                <button 
                  onClick={applyPromoCode}
                  className="bg-gray-800 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-blue-600 transition-all"
                >Apply</button>
             </div>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex justify-between text-gray-500">
              <span>Subtotal</span>
              <span className="font-bold text-gray-800">${subTotal.toFixed(2)}</span>
            </div>
            
            {discount > 0 && (
              <div className="flex justify-between text-red-500">
                <span>Discount (10%)</span>
                <span className="font-bold">-${discountValue.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between text-gray-500">
              <span>Shipping</span>
              <span className="text-green-500 font-bold">Free</span>
            </div>
            
            <div className="pt-4 border-t flex justify-between items-center">
              <span className="text-lg font-bold text-gray-800">Total</span>
              <span className="text-3xl font-black text-blue-600">${finalTotal.toFixed(2)}</span>
            </div>
          </div>

          <button 
            onClick={handleCheckout}
            className="w-full bg-blue-600 text-white p-4 rounded-2xl font-bold hover:bg-gray-900 transition-all shadow-lg"
          >
            Proceed to Checkout 💳
          </button>
        </div>
      </div>
    </div>
  );
}