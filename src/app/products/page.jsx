"use client";
import { useEffect, useState } from "react";
import ProductCard from "@/components/Common/ProductCard";
import { Search, Filter, SlidersHorizontal, X } from "lucide-react";
import { toast } from "react-hot-toast";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("All");
  const [maxPrice, setMaxPrice] = useState(10000);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const url = `/api/products?keyword=${keyword}&category=${category}&maxPrice=${maxPrice}`;
      const res = await fetch(url);
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [category, maxPrice]);

  return (
    <div className="min-h-screen bg-[#f8fbff]" dir="ltr">
      <div className="max-w-7xl mx-auto px-6 py-10">
        
        {/* Page Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Shop Products</h2>
            <p className="text-slate-500 text-sm mt-1">Explore the best deals at Sky Store</p>
          </div>
          
          <div className="relative w-full md:w-96 group">
            <input 
              type="text" 
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchProducts()}
              className="w-full bg-white border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:ring-4 focus:ring-blue-100 outline-none transition-all"
              placeholder="Search for products..."
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <button 
              onClick={fetchProducts}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#0a192f] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-blue-600 transition-all"
            >
              Search
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full lg:w-72">
            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm sticky top-24">
              <div className="flex items-center gap-2 mb-8 pb-4 border-b border-slate-50">
                <SlidersHorizontal size={18} className="text-blue-600" />
                <span className="font-bold text-slate-900 text-lg">Filters</span>
              </div>

              <div className="mb-8">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Categories</label>
                <div className="space-y-2">
                  {["All", "Electronics", "Fashion", "Home", "Beauty"].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                        category === cat 
                        ? "bg-blue-50 text-blue-600 border border-blue-100" 
                        : "text-slate-500 hover:bg-slate-50 border border-transparent"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Max Price</label>
                <input 
                  type="range" min="0" max="100000" step="100"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between mt-3 font-bold">
                  <span className="text-[10px] text-slate-400">$0</span>
                  <span className="text-sm text-blue-600">${maxPrice}</span>
                </div>
              </div>
              
              <button 
                onClick={() => {setCategory("All"); setMaxPrice(100000); setKeyword("");}}
                className="w-full mt-8 flex items-center justify-center gap-2 text-slate-400 hover:text-red-500 text-xs font-bold transition-colors"
              >
                <X size={14} /> Reset Filters
              </button>
            </div>
          </aside>

          {/* Products Grid */}
          <main className="flex-1">
            {loading ? (
              <div className="flex justify-center items-center min-h-[40vh]">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {products.map((item) => <ProductCard key={item._id} product={item} />)}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}