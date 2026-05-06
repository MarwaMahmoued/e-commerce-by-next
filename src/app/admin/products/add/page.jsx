"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { FaPlusCircle, FaCloudUploadAlt, FaTag, FaDollarSign, FaBoxes } from "react-icons/fa"; // أضفت أيقونة الـ Boxes

export default function AddProduct() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "Electronics",
    images: "",
    stock: 1,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...product,
          images: [product.images],
          stock: Number(product.stock),
          seller: "65f1a2b3c4d5e6f7a8b9c0d1" 
        }),
      });

    if (res.ok) {
        toast.success("Product added successfully! 🎉", {
          duration: 3000, // خليها تظهر لمدة 3 ثواني
          position: "top-center",
        });

       
        setTimeout(() => {
          router.push("/admin/dashboard");
        }, 1500); 
        
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || "Failed to add product");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8" dir="ltr">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl mb-4">
            <FaPlusCircle size={32} />
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Add New Product</h1>
          <p className="text-gray-500 mt-2 text-lg">Create a new listing for your store inventory</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-blue-900/5 border border-gray-100 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8 sm:p-12 space-y-8">
            
            {/* Product Name */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                <FaTag className="text-blue-500" /> Product Title
              </label>
              <input 
                type="text" 
                className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all text-gray-800 placeholder-gray-400"
                placeholder="e.g. Wireless Noise Cancelling Headphones"
                value={product.name} 
                onChange={(e) => setProduct({...product, name: e.target.value})} 
                required 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                  <FaDollarSign className="text-blue-500" /> Price ($)
                </label>
                <input 
                  type="number" 
                  className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all text-gray-800"
                  placeholder="0.00"
                  value={product.price} 
                  onChange={(e) => setProduct({...product, price: e.target.value})} 
                  required 
                />
              </div>

             
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                  <FaBoxes className="text-blue-500" /> Inventory Stock
                </label>
                <input 
                  type="number" 
                  className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all text-gray-800"
                  placeholder="Quantity available"
                  value={product.stock} 
                  onChange={(e) => setProduct({...product, stock: e.target.value})} 
                  min="0"
                  required 
                />
              </div>
            </div>

        
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">Category</label>
              <select 
                className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all text-gray-800 appearance-none cursor-pointer"
                value={product.category}
                onChange={(e) => setProduct({...product, category: e.target.value})}
              >
                <option value="Electronics">Electronics</option>
                <option value="Fashion">Fashion</option>
                <option value="Home">Home</option>
                <option value="Beauty">Beauty</option>
              </select>
            </div>

           
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">Description</label>
              <textarea 
                className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all text-gray-800 min-h-[120px]"
                placeholder="Tell your customers about the features, specs, and benefits..."
                value={product.description} 
                onChange={(e) => setProduct({...product, description: e.target.value})} 
                required
              ></textarea>
            </div>

        
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                <FaCloudUploadAlt className="text-blue-500" /> Product Image Link
              </label>
              <input 
                type="text" 
                className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all text-gray-800 placeholder-gray-400"
                placeholder="https://example.com/image.jpg"
                value={product.images} 
                onChange={(e) => setProduct({...product, images: e.target.value})} 
                required 
              />
            </div>

    
            <div className="pt-4">
              <button 
                type="submit" 
                disabled={loading}
                className={`w-full py-5 rounded-2xl font-black text-xl transition-all shadow-lg flex items-center justify-center gap-3
                  ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-gray-900 text-white shadow-blue-200 hover:shadow-xl"}`}
              >
                {loading ? (
                  <span className="animate-pulse">Processing...</span>
                ) : (
                  <>
                    <span>Add Product to Store</span>
                    <FaPlusCircle />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}