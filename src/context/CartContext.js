"use client";
import { createContext, useContext, useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const { data: session, status } = useSession();
  const isInitialMount = useRef(true);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadCart = async () => {
      if (status === "loading") return;

      if (status === "authenticated") {
        try {
          const res = await fetch("/api/cart/get-all");
          const data = await res.json();
          if (res.ok && data.cart) {
            setCart(data.cart);
          }
        } catch (error) {
          console.error("Failed to fetch cart:", error);
        }
      } else if (status === "unauthenticated") {
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
          setCart(JSON.parse(savedCart));
        }
      }
      setIsLoaded(true);
    };
    loadCart();
  }, [status]);

  useEffect(() => {
    if (isInitialMount.current || !isLoaded) {
      isInitialMount.current = false;
      return;
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    const syncCartWithServer = async () => {
      if (status === "authenticated") {
        try {
          await fetch("/api/cart/sync", {
            method: "POST",
            body: JSON.stringify({ cartItems: cart }),
            headers: { "Content-Type": "application/json" },
          });
        } catch (error) {
          console.log("Cart sync background error");
        }
      }
    };

    const timeoutId = setTimeout(syncCartWithServer, 1000);
    return () => clearTimeout(timeoutId);
  }, [cart, status, isLoaded]);

  const totalPrice = cart.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);

  const addToCart = (product) => {
    const isExist = cart.find((item) => item._id === product._id);

    if (isExist) {
      toast.success("Increased item quantity");
      setCart((prevCart) =>
        prevCart.map((item) =>
          item._id === product._id ? { ...item, quantity: (item.quantity || 1) + 1 } : item
        )
      );
    } else {
      toast.success("Added to cart");
      setCart((prevCart) => [...prevCart, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    setCart((prevCart) =>
      prevCart.map((item) =>
        item._id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeFromCart = (productId) => {
    toast.error("Item removed from cart");
    setCart((prevCart) => prevCart.filter((item) => item._id !== productId));
  };

  const clearCart = () => {
    toast.success("Cart cleared");
    setCart([]);
    localStorage.removeItem("cart");
  };

  return (
    <CartContext.Provider value={{ cart, isLoaded, addToCart, removeFromCart, clearCart, updateQuantity, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};