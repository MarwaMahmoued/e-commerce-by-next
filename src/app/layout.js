import Navbar from "@/components/Common/Navbar";
import AuthContext from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { Toaster } from "react-hot-toast"; // 1. استيراد التوستر
import "./globals.css";

export const metadata = {
  title: "Sky Store",
  description: "My Perfect Store Project",
};

export default function RootLayout({ children }) {
  return (
   <html lang="en" suppressHydrationWarning={true}>
      <body className="bg-gray-50 text-gray-900 min-h-screen">
        {/* 2. وضع التوستر هنا عشان يظهر فوق أي صفحة */}
        <Toaster 
          position="top-center" 
          reverseOrder={false} 
          toastOptions={{
            duration: 3000,
            style: {
              fontFamily: 'sans-serif',
              direction: 'rtl'
            }
          }}
        />
        
        <AuthContext>
          <CartProvider>
            <Navbar />
            <main className="min-h-screen">
              {children}
            </main>
          </CartProvider>
        </AuthContext>
      </body>
    </html>
  );
}