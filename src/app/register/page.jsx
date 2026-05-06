"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-hot-toast";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
      
        toast.success("Registration successful! 📧 Please check your email to verify your account before logging in.", {
          duration: 6000, 
          position: "top-center",
        });

       
        setTimeout(() => {
          router.push("/login");
        }, 2500);

      } else {
        const errorMessage = data.message || "Registration failed. Please try again.";
        setError(errorMessage);
        toast.error(errorMessage);
        setLoading(false);
      }
    } catch (err) {
      const connError = "Connection error. Please check your internet.";
      setError(connError);
      toast.error(connError);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f3f4f6] p-4 lg:p-8" dir="ltr">
      
      <div className="flex w-full max-w-5xl bg-white shadow-2xl rounded-3xl overflow-hidden border border-gray-100">
        
        {/* 1. Form Section */}
        <div className="w-full md:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
          <h2 className="text-3xl font-black text-gray-800 mb-2">
            Create Account ✍️
          </h2>
          <p className="text-gray-500 mb-8 font-medium">
            Join us and start your premium shopping experience
          </p>

          {error && (
            <div className="p-3 mb-6 text-sm text-red-700 bg-red-50 rounded-xl text-center border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                placeholder="e.g. Marwa Mahmoud"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  placeholder="01xxxxxxxxx"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 text-white font-bold rounded-xl transition-all shadow-lg ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 shadow-blue-100 hover:shadow-blue-200"
              }`}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <p className="mt-8 text-center text-gray-600 text-sm">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 font-bold hover:underline">
              Sign In
            </Link>
          </p>
        </div>

     
        <div className="hidden md:flex w-1/2 items-center justify-center bg-blue-50 relative p-12">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          
          <div className="relative z-10 text-center">
            <Image
              src="/register-animation.gif" 
              alt="shopping animation"
              width={450}
              height={450}
              className="object-contain drop-shadow-2xl animate-bounce-slow"
              unoptimized 
            />
            <h3 className="mt-8 text-2xl font-bold text-blue-700">Welcome to Our Store</h3>
            <p className="text-blue-500 mt-2">The best products are waiting for you</p>
          </div>
        </div>

      </div>
    </div>
  );
}