"use client";
import React, { useEffect, useState } from 'react';
import ProductCard from '@/components/Common/ProductCard'; 
import { toast } from 'react-hot-toast';
import Link from 'next/link';

const WishlistPage = () => {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                const res = await fetch('/api/wishlist/get-all'); 
                const data = await res.json();

                if (res.ok) {
                    setWishlistItems(data.wishlist || []);
                } else {
                    toast.error(data.error || "Failed to load wishlist");
                }
            } catch (error) {
                console.error("Error fetching wishlist:", error);
                toast.error("An error occurred while loading data");
            } finally {
                setLoading(false);
            }
        };

        fetchWishlist();
    }, []);

    
    const handleRemoveSuccess = (productId) => {
        setWishlistItems(prev => prev.filter(item => item._id !== productId));
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8" dir="ltr">
            <div className="max-w-7xl mx-auto">
                <header className="mb-10 text-center">
                    <h1 className="text-4xl font-black text-gray-900 mb-2">My Wishlist ❤️</h1>
                    <p className="text-gray-500">All the products you love in one place</p>
                </header>

                {wishlistItems.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {wishlistItems.map((product) => (
                            <ProductCard 
                                key={product._id} 
                                product={product} 
                                onWishlistChange={() => handleRemoveSuccess(product._id)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-[3rem] shadow-sm border border-gray-100">
                        <div className="text-6xl mb-4">🛒</div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Your wishlist is currently empty</h2>
                        <p className="text-gray-500 mb-8">Browse the store and add some products you like!</p>
                        <Link 
                            href="/products" 
                            className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-blue-700 transition-colors shadow-lg"
                        >
                            Start Shopping Now
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WishlistPage;