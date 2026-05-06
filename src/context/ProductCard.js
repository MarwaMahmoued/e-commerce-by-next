"use client";
import React from 'react';
import { useCart } from "@/context/CartContext";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
   const isOutOfStock = product.stock <= 0;

  const handleAddToCart = () => {
    if (!isOutOfStock) {
      addToCart(product);
    }
  };

  return (
    <div className="card h-100 shadow-sm border-0 position-relative" style={{ borderRadius: "20px", overflow: "hidden", transition: "0.3s" }}>
      
    
      <div className="position-absolute" style={{ top: "15px", left: "15px", zIndex: 2 }}>
         <div className="bg-white rounded-circle d-flex align-items-center justify-content-center shadow-sm" style={{ width: "35px", height: "35px", cursor: "pointer" }}>
            <i className="bi bi-heart text-muted"></i>
         </div>
      </div>

      
      <div style={{ height: "220px", overflow: "hidden", position: "relative" }}>
        <img 
          src={product.images && product.images[0] ? product.images[0] : "https://via.placeholder.com/300"} 
          className="card-img-top" 
          alt={product.name}
          style={{ 
            width: "100%", 
            height: "100%", 
            objectFit: "cover",
            filter: isOutOfStock ? "grayscale(80%)" : "none" 
          }}
        />
    
        <div className="position-absolute" style={{ top: "15px", right: "15px" }}>
            <span className="badge rounded-pill px-3 py-2" style={{ backgroundColor: "#E3F2FD", color: "#0D47A1", fontSize: "0.7rem", fontWeight: "bold" }}>
                {product.category?.toUpperCase()}
            </span>
        </div>
      </div>
      
      <div className="card-body d-flex flex-column px-4">
        <h5 className="card-title mb-1" style={{ color: "#1A237E", fontWeight: "800", fontSize: "1.2rem" }}>
          {product.name}
        </h5>

        <p className="card-text text-muted mb-3" style={{ fontSize: "0.85rem", minHeight: "40px" }}>
          {product.description?.substring(0, 45)}...
        </p>

        <div className="mt-auto">
          <div className="d-flex justify-content-between align-items-end">
            <div>
              <span className="d-block h4 mb-0" style={{ color: "#212121", fontWeight: "800" }}>
                ${product.price}
              </span>
              
             
              <small style={{ 
                  fontSize: "0.75rem", 
                  fontWeight: "700", 
                  color: isOutOfStock ? "#ef5350" : "#66bb6a" 
              }}>
                {isOutOfStock ? "❌ Out of Stock" : `In Stock: ${product.stock}`}
              </small>
            </div>
            
            <div className="d-flex gap-2">
                
                <button className="btn border rounded-3 d-flex align-items-center justify-content-center" style={{ width: "40px", height: "40px" }}>
                    <i className="bi bi-eye text-muted"></i>
                </button>

                <button 
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    className="btn d-flex align-items-center gap-2 px-3" 
                    style={{ 
                        backgroundColor: isOutOfStock ? "#e0e0e0" : "#1A237E", 
                        color: isOutOfStock ? "#9e9e9e" : "#fff",
                        borderRadius: "10px",
                        fontWeight: "600",
                        border: "none",
                        cursor: isOutOfStock ? "not-allowed" : "pointer",
                        height: "40px"
                    }}
                >
                    <i className="bi bi-cart3"></i>
                    {isOutOfStock ? "Sold" : "Add"}
                </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;