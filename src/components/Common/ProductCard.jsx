"use client";
import React from 'react';
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { Heart, ShoppingCart, Eye, Package } from "lucide-react"; 

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();


  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  const handleWishlist = async (e) => {
    e.preventDefault(); 
    try {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product._id }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "Added to wishlist ❤️");
      } else {
        toast.error(data.error || "Please login first to save items");
      }
    } catch (error) {
      toast.error("Connection error with server");
      console.error("Wishlist Error:", error);
    }
  };

  const handleAddToCart = (e) => {
    e.preventDefault(); 
    if (isOutOfStock) {
      toast.error("Sorry, this item is out of stock");
      return;
    }
    addToCart(product);
    toast.success("Added to cart 🛒", {
      position: "bottom-right",
      style: {
        borderRadius: '12px',
        background: '#0a192f',
        color: '#fff',
      },
    });
  };

  return (
    <div className={`bg-white rounded-[2rem] shadow-lg shadow-blue-900/5 overflow-hidden border border-slate-50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group relative ${isOutOfStock ? 'opacity-80' : ''}`}>
      
  
      <button 
        onClick={handleWishlist}
        className="absolute top-4 left-4 z-10 bg-white/80 backdrop-blur-md p-2.5 rounded-2xl shadow-sm text-slate-400 hover:text-red-500 hover:scale-110 transition-all duration-300"
      >
        <Heart size={18} />
      </button>

     
      <Link href={`/products/${product._id}`} className="relative h-56 w-full overflow-hidden block">
        <img 
          src={product.images && product.images[0] ? product.images[0] : "https://via.placeholder.com/400"} 
          className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ${isOutOfStock ? 'grayscale' : ''}`} 
          alt={product.name}
        />
        
        
        <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
          <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm border border-white/20">
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
              {product.category}
            </span>
          </div>
          
          {isOutOfStock ? (
            <div className="bg-red-500 text-white px-3 py-1 rounded-full shadow-sm text-[9px] font-bold uppercase tracking-tighter">
              Out of Stock
            </div>
          ) : isLowStock ? (
            <div className="bg-orange-500 text-white px-3 py-1 rounded-full shadow-sm text-[9px] font-bold uppercase tracking-tighter">
              Only {product.stock} left
            </div>
          ) : null}
        </div>
      </Link>
      
      <div className="p-6 flex flex-col flex-grow text-left">
        <div className="flex justify-between items-start mb-3">
          <Link href={`/products/${product._id}`}>
            <h3 className="text-lg font-bold text-slate-800 leading-tight hover:text-blue-600 transition-colors">
              {product.name}
            </h3>
          </Link>
        </div>

        <p className="text-slate-500 text-xs mb-4 flex-grow line-clamp-2 leading-relaxed">
          {product.description}
        </p>

 
            <div className="flex items-center gap-1.5 mb-4">
            <Package size={14} className={isOutOfStock ? "text-red-400" : "text-slate-400"} />
            <span className={`text-[11px] font-bold uppercase ${isOutOfStock ? "text-red-500" : "text-slate-500"}`}>
                {isOutOfStock ? "Sold Out" : `Availability: ${product.stock} items`}
            </span>
        </div>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50 gap-2">
          <span className="text-xl font-bold text-slate-900">
            ${product.price}
          </span>
          
          <div className="flex gap-2">
            <Link 
              href={`/products/${product._id}`}
              className="text-slate-400 border border-slate-100 p-2.5 rounded-xl hover:bg-slate-50 hover:text-blue-600 transition-all"
              title="View Details"
            >
              <Eye size={18} />
            </Link>

            <button 
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs active:scale-95 transition-all shadow-md flex items-center gap-2 ${
                isOutOfStock 
                ? "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none" 
                : "bg-[#0a192f] text-white hover:bg-blue-600 shadow-blue-900/10"
              }`}
            >
              <ShoppingCart size={14} />
              {isOutOfStock ? "Empty" : "Add"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;