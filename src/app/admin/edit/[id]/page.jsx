"use client";
import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function EditProduct({ params }) {
  const router = useRouter();
  const resolvedParams = use(params); 
  const productId = resolvedParams.id;

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    stock: 0,      
    images: [""],  
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (productId) {
      fetch(`/api/products/${productId}`)
        .then((res) => res.json())
        .then((data) => {
          setFormData({
            name: data.name || "",
            price: data.price || "",
            category: data.category || "",
            description: data.description || "",
            stock: data.stock || 0, 
            images: data.images && data.images.length > 0 ? data.images : [""], 
          });
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching product:", err);
          toast.error("Failed to load product data");
          setLoading(false);
        });
    }
  }, [productId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    
    if (name === "images") {
      setFormData({ ...formData, images: [value] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success("Product updated successfully! 🎉");
        router.push("/admin/dashboard");
      } else {
        toast.error("Failed to update product");
      }
    } catch (error) {
      toast.error("An error occurred while saving");
    }
  };

  if (loading) return <div className="text-center p-20 font-bold text-blue-600">Loading Product Data...</div>;

  return (
    <div className="max-w-2xl mx-auto p-10" dir="ltr">
      <h1 className="text-3xl font-black mb-8 text-gray-800">Edit Product ✏️</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100">
        
        {/* Name */}
        <div>
          <label className="block mb-2 font-bold text-gray-600">Product Name</label>
          <input 
            type="text" 
            name="name" 
            value={formData.name} 
            onChange={handleChange}
            className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Price */}
          <div>
            <label className="block mb-2 font-bold text-gray-600">Price ($)</label>
            <input 
              type="number" 
              name="price" 
              value={formData.price} 
              onChange={handleChange}
              className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          {/* Stock */}
          <div>
            <label className="block mb-2 font-bold text-gray-600">Stock Quantity</label>
            <input 
              type="number" 
              name="stock" 
              value={formData.stock} 
              onChange={handleChange}
              className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block mb-2 font-bold text-gray-600">Category</label>
          <select 
            name="category" 
            value={formData.category} 
            onChange={handleChange}
            className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select Category</option>
            <option value="Electronics">Electronics</option>
            <option value="Fashion">Fashion</option>
            <option value="Home">Home</option>
            <option value="Beauty">Beauty</option>
            <option value="Others">Others</option>
          </select>
        </div>

        {/* Image URL */}
        <div>
          <label className="block mb-2 font-bold text-gray-600">Main Image URL</label>
          <input 
            type="text" 
            name="images" 
            placeholder="https://example.com/image.jpg"
            value={formData.images[0]} 
            onChange={handleChange}
            className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500"
            required
          />
          {formData.images[0] && (
            <div className="mt-4">
               <p className="text-sm text-gray-500 mb-2">Preview:</p>
               <img src={formData.images[0]} alt="Preview" className="w-24 h-24 object-cover rounded-xl border" />
            </div>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block mb-2 font-bold text-gray-600">Description</label>
          <textarea 
            name="description" 
            value={formData.description} 
            onChange={handleChange} 
            rows="4"
            className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500"
            required
          ></textarea>
        </div>

        <div className="flex gap-4">
            <button 
                type="button" 
                onClick={() => router.back()}
                className="w-1/3 bg-gray-100 text-gray-600 p-5 rounded-2xl font-bold hover:bg-gray-200 transition-all"
            >
                Cancel
            </button>
            <button 
                type="submit" 
                className="w-2/3 bg-blue-600 text-white p-5 rounded-2xl font-black text-xl hover:bg-gray-900 transition-all shadow-lg shadow-blue-100"
            >
                Save Changes 
            </button>
        </div>
      </form>
    </div>
  );
}