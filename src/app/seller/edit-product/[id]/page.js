"use client";
import { useEffect, useState, use } from "react"; 
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";

export default function SellerEditProduct({ params }) {
  const router = useRouter();
  

  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const { data: session } = useSession();
  
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    stock: "",
    category: "",
    images: [""]
  });

 
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (res.ok) {
          const data = await res.json();
          setFormData(data);
        } else {
          toast.error("Product not found");
          router.push("/seller/dashboard");
        }
      } catch (err) {
        toast.error("Error loading product");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id, router]);


  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PATCH", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success("Product updated successfully!", { position: "top-center" });
        router.push("/seller/dashboard");
      } else {
        toast.error("Failed to update product");
      }
    } catch (err) {
      toast.error("Network error, try again");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center font-black text-purple-600 animate-pulse text-2xl tracking-tighter">
        LOADING PRODUCT DATA...
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 md:p-20 text-left">
      <div className="max-w-2xl mx-auto">
        <header className="mb-10">
          <button 
            onClick={() => router.back()} 
            className="text-gray-400 font-bold mb-4 hover:text-purple-600 transition-all flex items-center gap-2"
          >
            <span>←</span> Back to Dashboard
          </button>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">
            Edit Product <span className="text-purple-600">.</span>
          </h1>
        </header>

        <form onSubmit={handleUpdate} className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 ml-2">Product Name</label>
            <input 
              type="text" value={formData.name} required
              className="w-full p-5 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-purple-500 font-medium transition-all"
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 ml-2">Price ($)</label>
              <input 
                type="number" value={formData.price} required
                className="w-full p-5 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-purple-500 font-medium"
                onChange={(e) => setFormData({...formData, price: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 ml-2">Stock Units</label>
              <input 
                type="number" value={formData.stock} required
                className="w-full p-5 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-purple-500 font-medium"
                onChange={(e) => setFormData({...formData, stock: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 ml-2">Image URL</label>
            <input 
              type="text" value={formData.images[0]} required
              className="w-full p-5 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-purple-500 font-medium"
              onChange={(e) => setFormData({...formData, images: [e.target.value]})}
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 ml-2">Description</label>
            <textarea 
              value={formData.description} rows="4"
              className="w-full p-5 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-purple-500 font-medium resize-none"
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            ></textarea>
          </div>

          <button 
            type="submit" disabled={updating}
            className="w-full py-5 bg-purple-600 text-white rounded-2xl font-black hover:bg-purple-700 transition-all shadow-xl shadow-purple-100 disabled:opacity-50"
          >
            {updating ? "Saving Changes..." : "Update Product"}
          </button>
        </form>
      </div>
    </div>
  );
}