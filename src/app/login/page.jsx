"use client";
import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); 
  const [loading, setLoading] = useState(false); 
  const router = useRouter();
  const searchParams = useSearchParams();

 
  useEffect(() => {
    const urlError = searchParams.get("error");
    if (urlError) {
      const msg = urlError === "Please verify your email first to login." 
        ? "Account not verified. Please check your inbox! 📧" 
        : urlError;
      setError(msg);
      toast.error(msg);
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); 

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res.error) {
     
      const errorMessage = res.error === "CredentialsSignin" 
        ? "Invalid email or password." 
        : res.error;

      setError(errorMessage);
      toast.error(errorMessage);
      setLoading(false);
    } else {
      toast.success("Welcome back! Logging you in...");
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f3f4f6] p-4 lg:p-8" dir="ltr">
      
      <div className="flex w-full max-w-5xl bg-white shadow-2xl rounded-3xl overflow-hidden border border-gray-100">
        
       
        <div className="hidden md:flex w-1/2 items-center justify-center bg-blue-50 relative p-12">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          
          <div className="relative z-10 text-center">
            <Image
              src="/register-animation.gif" 
              alt="login animation"
              width={450}
              height={450}
              className="object-contain drop-shadow-2xl"
              unoptimized 
            />
            <h3 className="mt-8 text-2xl font-bold text-blue-700">My Perfect Store</h3>
            <p className="text-blue-500 mt-2 font-medium text-lg">Nice to see you again! Continue your shopping journey with us ✨</p>
          </div>
        </div>

        
        <div className="w-full md:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
          <h2 className="text-3xl font-black text-gray-800 mb-2">Welcome Back!</h2>
          <p className="text-gray-500 mb-8 font-medium">Sign in to continue shopping</p>

          {error && (
            <div className="p-3 mb-6 text-sm text-red-700 bg-red-50 rounded-xl text-center border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                placeholder="name@example.com"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
              <input
                type="password"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                placeholder="••••••"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 text-white font-bold rounded-xl transition-all shadow-lg ${
                loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 shadow-blue-100"
              }`}
            >
              {loading ? "Logging in..." : "Sign In"}
            </button>
          </form>

         
          <div className="mt-8">
            <div className="relative flex items-center justify-center mb-6">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink mx-4 text-gray-400 text-xs font-bold uppercase">Or login with</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            <div className="flex justify-center gap-6">
              <button 
                onClick={() => signIn("google")} 
                className="p-3 border border-gray-100 rounded-2xl hover:bg-gray-50 hover:shadow-md transition-all shadow-sm"
              >
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-7 h-7" alt="Google" />
              </button>
              <button 
                onClick={() => signIn("github")} 
                className="p-3 border border-gray-100 rounded-2xl hover:bg-gray-50 hover:shadow-md transition-all shadow-sm"
              >
                <img src="https://www.svgrepo.com/show/512317/github-142.svg" className="w-7 h-7" alt="Github" />
              </button>
              <button 
                onClick={() => signIn("facebook")} 
                className="p-3 border border-gray-100 rounded-2xl hover:bg-gray-50 hover:shadow-md transition-all shadow-sm"
              >
                <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" className="w-7 h-7" alt="Facebook" />
              </button>
            </div>
          </div>

          <p className="mt-8 text-center text-gray-600 text-sm">
            Don't have an account?{" "}
            <Link href="/register" className="text-blue-600 font-bold hover:underline">
              Create a new account
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}