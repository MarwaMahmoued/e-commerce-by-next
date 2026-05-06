"use client";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { ShoppingCart, Heart, User, LogOut, LayoutDashboard } from "lucide-react"; 

export default function Navbar() {
  const { data: session, status } = useSession();
  const { cart } = useCart();

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
   
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="text-2xl font-black tracking-tight text-gray-900 flex items-center"
            >
              Sky<span className="text-blue-600">Store</span>
            </Link>

           
            <div className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition">Home</Link>
              <Link href="/products" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition">Products</Link>
              <Link href="/orders" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition">Orders</Link>
              <Link href="/profile" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition">Profile</Link>
           
               {session?.user?.role === "seller" && (
  <Link href="/seller/dashboard" className="text-gray-700 hover:text-purple-600 font-bold">
    Dashboard   </Link>
)}
             
              {session?.user?.role === "admin" && (
                <Link 
                  href="/admin/dashboard" 
                  className="text-sm font-bold text-purple-600 bg-purple-50 px-3 py-1 rounded-full hover:bg-purple-100 transition"
                >
                  Admin
                </Link>
              )}
            </div>
          </div>

         
          <div className="flex items-center gap-4">
            
         
            <Link
              href="/cart"
              className="relative p-2.5 text-gray-700 hover:bg-gray-100 rounded-full transition-all"
            >
              <ShoppingCart size={22} strokeWidth={2.5} />
              {cart.length > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white ring-2 ring-white">
                  {cart.length}
                </span>
              )}
            </Link>

          
            <Link
              href="/wishlist"
              className="hidden sm:block p-2.5 text-gray-700 hover:bg-red-50 hover:text-red-500 rounded-full transition-all"
            >
              <Heart size={22} />
            </Link>

        
            {status === "authenticated" ? (
              <div className="flex items-center gap-3 ml-2 pl-4 border-l border-gray-100">
                <div className="flex flex-col items-end hidden sm:flex">
                  <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Logged in as</span>
                  <span className="text-sm font-bold text-gray-900">
                    {session?.user?.name || "User"}
                  </span>
                </div>
                
               
                <div className="bg-gray-100 p-2 rounded-xl">
                  <User size={20} className="text-gray-600" />
                </div>

                <button
                  onClick={() => signOut()}
                  className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="bg-gray-900 text-white px-6 py-2.5 rounded-2xl font-bold text-sm hover:bg-blue-600 transition-all shadow-md active:scale-95"
              >
                Login
              </Link>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}