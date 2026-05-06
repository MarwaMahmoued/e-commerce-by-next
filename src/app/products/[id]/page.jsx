"use client";
import { useCart } from "@/context/CartContext";
import { useEffect, useState, use } from "react";
import { toast } from "react-hot-toast";
import { Star, ShoppingCart, MessageSquare, Clock } from "lucide-react";

export default function ProductDetails({ params }) {
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  
 
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const resolvedParams = use(params);
  const productId = resolvedParams.id;

  const fetchProduct = () => {
    if (productId) {
      fetch(`/api/products/${productId}`)
        .then((res) => res.json())
        .then((data) => setProduct(data))
        .catch((err) => {
          console.error("Error fetching product:", err);
          toast.error("Could not load product details");
        });
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) return toast.error("Please select a star rating");
    
    setSubmitting(true);
    try {
      const res = await fetch(`/api/products/${productId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, comment }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Thank you for your review! ⭐");
        setRating(0);
        setComment("");
        fetchProduct();
      } else {
        toast.error(data.error || "Something went wrong");
      }
    } catch (err) {
      toast.error("Failed to connect to server");
    } finally {
      setSubmitting(false);
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-xl font-bold text-blue-600">Loading details...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12" dir="ltr">
      {/* 1. Product Details Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
        <div className="rounded-[3rem] overflow-hidden shadow-2xl bg-slate-50 border border-slate-100">
          <img 
            src={product.images?.[0] || "https://via.placeholder.com/600"} 
            className="w-full h-[500px] object-cover hover:scale-105 transition-transform duration-700" 
            alt={product.name}
          />
        </div>

        <div className="flex flex-col justify-center text-left">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-blue-600 font-bold tracking-widest uppercase text-xs px-3 py-1 bg-blue-50 w-fit rounded-lg">
              {product.category}
            </span>
            <span className="text-yellow-500 font-bold text-sm flex items-center gap-1">
              <Star size={16} fill="currentColor" /> {product.rating?.toFixed(1) || 0} ({product.numReviews} Reviews)
            </span>
          </div>
          
          <h1 className="text-5xl font-bold text-slate-900 mb-6 leading-tight">
            {product.name}
          </h1>
         
<p className="text-gray-500 text-lg leading-relaxed mb-8 max-w-xl w-full break-words">
  {product.description}
</p>
          
          <div className="flex items-center justify-between bg-slate-50 p-6 rounded-[2.5rem] border border-slate-100">
            <div className="flex flex-col">
              <span className="text-slate-400 text-xs font-bold mb-1">Price</span>
              <span className="text-4xl font-bold text-slate-900">${product.price}</span>
            </div>
            
            <button 
              onClick={() => {
                addToCart(product);
                toast.success("Added to cart! 🛒");
              }}
              className="bg-[#0a192f] text-white px-10 py-4 rounded-2xl font-bold hover:bg-blue-600 transition-all shadow-xl shadow-blue-900/10 active:scale-95 flex items-center gap-2"
            >
              <ShoppingCart size={20} /> Add to Cart
            </button>
          </div>
        </div>
      </div>

      <hr className="mb-12 border-slate-100" />

      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        
        {/* Add Review Form */}
        <div className="lg:col-span-1">
          <h3 className="text-2xl font-bold mb-6 text-slate-900">Add a Review ✨</h3>
          <form onSubmit={handleReviewSubmit} className="space-y-4 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Rating</label>
              <div className="flex gap-2 text-2xl">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setRating(num)}
                    className={`transition-all ${rating >= num ? "text-yellow-400 scale-110" : "text-slate-200 hover:text-yellow-200"}`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Your Experience</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
                className="w-full p-4 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-blue-100 h-32 text-sm outline-none"
                placeholder="How was the product?"
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#0a192f] text-white py-4 rounded-xl font-bold hover:bg-blue-600 transition-all disabled:opacity-50"
            >
              {submitting ? "Sending..." : "Submit Review"}
            </button>
          </form>
        </div>

        {/* Display Reviews */}
        <div className="lg:col-span-2">
          <h3 className="text-2xl font-bold mb-6 text-slate-900 flex items-center gap-2">
            <MessageSquare size={24} className="text-blue-600" />
            Customer Reviews ({product.reviews?.length || 0})
          </h3>
          <div className="space-y-6">
            {product.reviews && product.reviews.length > 0 ? (
              product.reviews.map((rev) => (
                <div key={rev._id} className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-bold text-slate-800">{rev.name}</span>
                    <span className="text-yellow-500 font-bold text-sm">
                      {"★".repeat(rev.rating)}
                    </span>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">{rev.comment}</p>
                  <div className="flex items-center gap-1 text-[10px] text-slate-300 mt-4">
                    <Clock size={10} />
                    <span>{new Date(rev.createdAt).toLocaleDateString("en-US")}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 bg-slate-50 rounded-[2rem] border border-dashed border-slate-200 text-slate-400 italic">
                No reviews yet. Be the first to share your experience!
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}