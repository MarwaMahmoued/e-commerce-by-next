import Link from "next/link";
import { ArrowRight, PackageSearch, Sparkles, Star, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="relative min-h-[calc(100vh-80px)] flex items-center overflow-hidden bg-gradient-to-br from-[#f4f9ff] via-white to-[#eef6ff]">
      
      {/* Glow Effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-200/40 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-sky-200/40 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full py-20">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-24 items-center">

          {/* LEFT CONTENT */}
          <div className="space-y-8">
            
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100/60 border border-blue-200/50 backdrop-blur">
              <Sparkles size={14} className="text-blue-600" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-blue-700">
                Sky Store • Premium Collection
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight tracking-tight">
              Professional{" "}
              <span className="text-blue-600">Commerce</span> <br />
              For Your Modern <br />
              Digital Lifestyle.
            </h1>

            <p className="text-base sm:text-lg text-slate-500 max-w-lg leading-relaxed">
              Access powerful analytics and manage your store with a clean, modern experience designed for you.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              
              <Link
                href="/products"
                className="group flex items-center gap-2.5 bg-[#0a192f] text-white px-7 py-3.5 rounded-2xl font-semibold text-sm hover:bg-blue-600 transition-all duration-300 shadow-lg hover:shadow-blue-500/20 active:scale-95"
              >
                <PackageSearch size={18} />
                Explore Products
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
              </Link>

              <Link
                href="/about"
                className="px-7 py-3.5 rounded-2xl font-semibold text-sm text-blue-900 hover:bg-white transition-all duration-300 border border-blue-100 bg-white/60 backdrop-blur"
              >
                Learn More
              </Link>

            </div>
          </div>

          {/* RIGHT CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

            {/* Card 1 */}
            <div className="group bg-white p-8 rounded-[28px] shadow-xl hover:shadow-2xl transition-all duration-300 border border-blue-50 space-y-6 sm:translate-y-8 hover:-translate-y-1">
              
              <div className="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition">
                <Zap size={24} />
              </div>

              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-blue-400">
                  Trusted Platform
                </p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">
                  24/7 <br /> Performance
                </h3>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                Fast product search and reliable checkout experience.
              </p>
            </div>

            {/* Card 2 */}
            <div className="group bg-[#0a192f] p-8 rounded-[28px] shadow-xl hover:shadow-2xl transition-all duration-300 space-y-6 text-white hover:-translate-y-1">
              
              <div className="h-12 w-12 bg-white/10 rounded-xl flex items-center justify-center text-blue-400 group-hover:scale-110 transition">
                <Star size={24} />
              </div>

              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-blue-300/50">
                  Ecommerce Metrics
                </p>
                <h3 className="text-2xl font-bold mt-1">
                  4.8/5 <br /> User Rating
                </h3>
              </div>

              <p className="text-xs text-blue-100/70 leading-relaxed">
                Designed for shoppers with a refined modern interface.
              </p>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}