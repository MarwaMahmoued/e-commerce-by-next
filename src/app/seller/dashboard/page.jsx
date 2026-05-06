"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function SellerDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]); 

  const [stats, setStats] = useState({
    totalProducts: 0,
    totalSales: 0,
    activeOrders: 0,
    topProduct: { name: "N/A", sales: 0 }
  });

  const chartData = [
    { day: 'Mon', sales: 400 },
    { day: 'Tue', sales: 700 },
    { day: 'Wed', sales: 500 },
    { day: 'Thu', sales: 900 },
    { day: 'Fri', sales: 1200 },
    { day: 'Sat', sales: 800 },
    { day: 'Sun', sales: 1100 },
  ];

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "Electronics",
    images: [""],
    description: "",
    stock: 0, 
    seller: "" 
  });

  const fetchSellerProducts = async () => {
    try {
      const res = await fetch(`/api/products?seller=${session.user.id}`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };


  const handleDelete = async (productId) => {
    toast((t) => (
      <div className="flex flex-col gap-2">
        <span className="font-medium text-gray-800">Are you sure you want to delete this?</span>
        <div className="flex gap-2 justify-end">
          <button 
            onClick={() => toast.dismiss(t.id)}
            className="bg-gray-200 px-3 py-1 rounded-lg text-sm font-semibold"
          >
            Cancel
          </button>
          <button 
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                const res = await fetch(`/api/products/${productId}`, { method: "DELETE" });
                if (res.ok) {
                  toast.success("Product deleted successfully");
                  setProducts(products.filter((p) => p._id !== productId));
                } else {
                  toast.error("Failed to delete product");
                }
              } catch (error) {
                toast.error("Network error occurred");
              }
            }}
            className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm font-semibold"
          >
            Delete
          </button>
        </div>
      </div>
    ), { duration: 5000 });
  };

  useEffect(() => {
    const fetchSellerStats = async () => {
      try {
        const res = await fetch(`/api/seller/stats?sellerId=${session.user.id}`);
        if (res.ok) {
          const data = await res.json();
          setStats({
            totalProducts: data.totalProducts || 0,
            totalSales: Number(data.totalSales) || 0,
            activeOrders: data.activeOrders || 0,
            topProduct: data.topProduct || { name: "No Sales Yet", sales: 0 }
          });
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    if (status === "authenticated") {
      if (session?.user?.role !== "seller") {
        router.push("/profile");
      } else {
        setFormData((prev) => ({ ...prev, seller: session.user.id }));
        fetchSellerStats();
        fetchSellerProducts(); 
      }
    }
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [session, status, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const finalData = {
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock), 
      images: [formData.images[0]],
    };

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalData),
      });

      if (res.ok) {
        toast.success("Product added successfully!");
        setIsModalOpen(false);
        setFormData({ 
          name: "", price: "", category: "Electronics", 
          images: [""], description: "", stock: 0,
          seller: session.user.id 
        });
        fetchSellerProducts();
      }
    } catch (error) {
      toast.error("An error occurred while adding the product");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") return <div className="p-20 text-center font-bold text-purple-600 animate-pulse text-2xl">Initializing Workspace...</div>;

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-10 relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">Seller Dashboard <span className="text-purple-600">.</span></h1>
            <p className="text-gray-500 font-medium text-lg">Manage your business and monitor growth</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-purple-600 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-purple-200 hover:bg-purple-700 hover:-translate-y-1 transition-all duration-300 z-10"
          >
            + Create Product
          </button>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 text-left">
          <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 p-7 rounded-[2rem] shadow-xl text-white">
            <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">Revenue</p>
            <p className="text-4xl font-black mt-2">${stats.totalSales.toLocaleString()}</p>
            <p className="mt-4 text-emerald-400 font-bold text-xs">↑ 12.5% vs last period</p>
          </div>

          <div className="bg-white p-7 rounded-[2rem] shadow-sm border border-gray-100">
            <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">Inventory</p>
            <p className="text-4xl font-black text-gray-900 mt-2">{products.length}</p>
            <p className="text-purple-600 font-bold text-sm mt-2">Active listings</p>
          </div>

          <div className="bg-white p-7 rounded-[2rem] shadow-sm border border-gray-100">
            <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">Orders</p>
            <p className="text-4xl font-black text-gray-900 mt-2">{stats.activeOrders}</p>
            <p className="text-blue-500 font-bold text-xs mt-2">Processing</p>
          </div>

          <div className="bg-white p-7 rounded-[2rem] shadow-sm border border-gray-100">
            <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">Best Selling</p>
            <p className="text-xl font-black text-gray-900 mt-2 truncate">{stats.topProduct.name}</p>
            <p className="text-emerald-500 font-bold text-xs mt-2">{stats.topProduct.sales} sold</p>
          </div>
        </div>

        {/* Sales Chart */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 mb-10">
          <h3 className="text-xl font-black text-gray-800 mb-8">Growth Analytics</h3>
          <div className="h-[350px] w-full min-h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#9333ea" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#9333ea" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 'bold'}} dy={10} />
                <YAxis hide />
                <Tooltip contentStyle={{borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                <Area type="monotone" dataKey="sales" stroke="#9333ea" strokeWidth={4} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* --- Product Table --- */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
          <h3 className="text-xl font-black text-gray-800 mb-6">Product Management</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-400 text-xs uppercase tracking-widest border-b border-gray-50">
                  <th className="pb-4 font-bold">Details</th>
                  <th className="pb-4 font-bold">Category</th>
                  <th className="pb-4 font-bold">Price</th>
                  <th className="pb-4 font-bold">Stock</th>
                  <th className="pb-4 font-bold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.length > 0 ? products.map((product) => (
                  <tr key={product._id} className="group hover:bg-gray-50 transition-colors">
                    <td className="py-5 flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-gray-100 overflow-hidden shadow-inner">
                         <img src={product.images[0]} className="w-full h-full object-cover" alt={product.name} />
                      </div>
                      <span className="font-bold text-gray-800">{product.name}</span>
                    </td>
                    <td className="py-5 text-gray-500 font-semibold">{product.category}</td>
                    <td className="py-5 font-black text-purple-600">${product.price}</td>
                    <td className="py-5">
                      <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${product.stock > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                        {product.stock} left
                      </span>
                    </td>
                    <td className="py-5 text-center">
                      <div className="flex justify-center gap-3">
                      <button 
  onClick={() => router.push(`/seller/edit-product/${product._id}`)}
  className="w-10 h-10 flex items-center justify-center bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all"
>
  ✏️
</button>
                        <button 
                          onClick={() => handleDelete(product._id)}
                          className="w-10 h-10 flex items-center justify-center bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                          title="Delete Product"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" className="py-12 text-center text-gray-400 font-medium">Your inventory is empty. Start by adding a product!</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal: Add Product */}
        {isModalOpen && (
           <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[999] p-4">
             <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl relative">
                <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-gray-400 hover:text-gray-900 transition-colors">✕</button>
                <h2 className="text-3xl font-black mb-8">New Listing</h2>
                
                <form onSubmit={handleSubmit} className="space-y-5">
                  <input
                    type="text" placeholder="Product Name" required
                    className="w-full p-5 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-purple-500"
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    value={formData.name}
                  />
                  
                  <div className="grid grid-cols-2 gap-5">
                    <input
                      type="number" placeholder="Price ($)" required
                      className="w-full p-5 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-purple-500"
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      value={formData.price}
                    />
                    <input
                      type="number" placeholder="Stock Level" required
                      className="w-full p-5 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-purple-500"
                      onChange={(e) => setFormData({...formData, stock: e.target.value})}
                      value={formData.stock}
                    />
                  </div>

                  <select 
                    className="w-full p-5 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-purple-500"
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    value={formData.category}
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Home">Home</option>
                  </select>

                  <input
                    type="text" placeholder="Image URL" required
                    className="w-full p-5 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-purple-500"
                    onChange={(e) => setFormData({...formData, images: [e.target.value]})}
                    value={formData.images[0]}
                  />

                  <button 
                    type="submit" disabled={loading}
                    className="w-full py-5 bg-purple-600 text-white rounded-2xl font-black hover:bg-purple-700 transition-all shadow-xl shadow-purple-100 mt-4"
                  >
                    {loading ? "Publishing..." : "Launch Product"}
                  </button>
                </form>
             </div>
           </div>
        )}
      </div>
    </div>
  );
}