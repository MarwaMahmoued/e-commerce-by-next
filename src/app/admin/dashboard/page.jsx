"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { toast, Toaster } from "react-hot-toast";

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    customers: 0,
    sellers: 0,
    stockStatus: 0
  });

  const fetchData = async () => {
    try {
      const [prodRes, orderRes, userRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/orders"),
        fetch("/api/users")
      ]);

      const prodData = await prodRes.json();
      const orderData = await orderRes.json();
      const userDataResponse = await userRes.json();

      setProducts(prodData || []);
      setOrders(orderData || []);
      
      if (userDataResponse.success) {
        setUsers(userDataResponse.users);
        const s = userDataResponse.stats;
        const sales = (orderData || []).reduce((acc, curr) => acc + (Number(curr.totalPrice) || 0), 0);
        
        setStats({
          totalSales: sales.toFixed(2),
          totalOrders: (orderData || []).length,
          customers: s.customers,
          sellers: s.sellers,
          stockStatus: (prodData || []).length
        });
      }

      const dailyMap = (orderData || []).reduce((acc, order) => {
        const day = new Date(order.createdAt).toLocaleDateString('en-US', { weekday: 'short' });
        acc[day] = (acc[day] || 0) + (Number(order.totalPrice) || 0);
        return acc;
      }, {});

      const formattedChart = Object.keys(dailyMap).map(day => ({
        name: day,
        sales: dailyMap[day]
      }));

      setChartData(formattedChart);
      setLoading(false);
    } catch (error) {
      console.error("Fetch error:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteUser = (userId) => {
    toast((t) => (
      <div className="flex flex-col gap-3 p-1">
        <p className="font-bold text-gray-800 text-sm">
          Permanently delete this user? 
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1.5 text-xs font-bold bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              await confirmDeleteUser(userId);
            }}
            className="px-3 py-1.5 text-xs font-bold bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-100"
          >
            Delete
          </button>
        </div>
      </div>
    ), { duration: 5000 });
  };

  const confirmDeleteUser = async (userId) => {
    const loadingToast = toast.loading("Deleting user...");
    try {
      const res = await fetch("/api/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message, { id: loadingToast });
        fetchData();
      } else {
        toast.error(data.message, { id: loadingToast });
      }
    } catch (error) {
      toast.error("An error occurred", { id: loadingToast });
    }
  };

  
  const handleDeleteProduct = (id) => {
    toast((t) => (
      <div className="flex flex-col gap-3 p-1">
        <p className="font-bold text-gray-800 text-sm">
          Delete this product from inventory? 
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1.5 text-xs font-bold bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200"
          >
            Keep it
          </button>
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              await confirmDeleteProduct(id);
            }}
            className="px-3 py-1.5 text-xs font-bold bg-red-600 text-white rounded-xl hover:bg-red-700 shadow-lg shadow-red-100"
          >
            Confirm Delete
          </button>
        </div>
      </div>
    ), { duration: 5000 });
  };

  const confirmDeleteProduct = async (id) => {
    const loadingToast = toast.loading("Removing product...");
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Product removed successfully!", { id: loadingToast });
        fetchData();
      } else {
        toast.error("Failed to delete product", { id: loadingToast });
      }
    } catch (error) {
      toast.error("Something went wrong", { id: loadingToast });
    }
  };

  const handleUpdateRole = async (userId, newRole) => {
    const loadingToast = toast.loading(`Changing role to ${newRole}...`);
    try {
      const res = await fetch("/api/users/role", { 
        method: "PATCH", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, newRole })
      });
      if (res.ok) {
        toast.success(`Role updated to ${newRole}! ✅`, { id: loadingToast });
        fetchData(); 
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || "Update failed", { id: loadingToast });
      }
    } catch (error) {
      toast.error("Something went wrong!", { id: loadingToast });
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen font-black text-blue-600 text-xl animate-pulse">Loading Dashboard... 🚀</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 bg-gray-50/50 min-h-screen" dir="ltr">
      <Toaster position="top-center" reverseOrder={false} gutter={8} toastOptions={{
        style: {
          borderRadius: '20px',
          background: '#fff',
          color: '#1f2937',
          boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
          padding: '16px'
        }
      }} />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-black text-gray-900">Overview 📊</h1>
          <p className="text-gray-500 mt-2">Manage your users and products from here</p>
        </div>
        <Link 
          href="/admin/products/add" 
          className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-gray-900 transition-all shadow-xl shadow-blue-100"
        >
          + Add New Product
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard title="Total Sales" value={`$${stats.totalSales}`} icon="💰" color="text-green-600" bg="bg-green-50" />
        <StatCard title="Total Orders" value={stats.totalOrders} icon="📦" color="text-blue-600" bg="bg-blue-50" />
        <StatCard title="Sellers" value={stats.sellers} icon="🏪" color="text-purple-600" bg="bg-purple-50" />
        <StatCard title="Customers" value={stats.customers} icon="👥" color="text-orange-600" bg="bg-orange-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          
          {/* Inventory Management */}
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden">
            <div className="p-8 border-b border-gray-50">
              <h2 className="text-xl font-black text-gray-800">Inventory Management</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th className="p-6 text-gray-400 font-bold text-sm">Product</th>
                    <th className="p-6 text-gray-400 font-bold text-sm">Price</th>
                    <th className="p-6 text-gray-400 font-bold text-sm text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {products.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50 transition-all">
                      <td className="p-6 flex items-center gap-4">
                        <img src={product.images?.[0]} className="w-12 h-12 rounded-xl object-cover shadow-sm" alt="" />
                        <div>
                           <p className="font-bold text-gray-800">{product.name}</p>
                           <p className="text-xs text-gray-400">{product.category}</p>
                        </div>
                      </td>
                      <td className="p-6 font-black text-blue-600">${product.price}</td>
                      <td className="p-6 text-center">
                        <div className="flex justify-center gap-2">
                          <Link href={`/admin/edit/${product._id}`} className="p-2 hover:bg-blue-50 rounded-lg">✏️</Link>
                          <button onClick={() => handleDeleteProduct(product._id)} className="p-2 hover:bg-red-50 rounded-lg">🗑️</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* User Management */}
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden">
            <div className="p-8 border-b border-gray-50">
              <h2 className="text-xl font-black text-gray-800">User Management</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th className="p-6 text-gray-400 font-bold text-sm">User</th>
                    <th className="p-6 text-gray-400 font-bold text-sm">Current Status</th>
                    <th className="p-6 text-gray-400 font-bold text-sm">Assign Role</th>
                    <th className="p-6 text-gray-400 font-bold text-sm text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50 transition-all">
                      <td className="p-6">
                        <p className="font-bold text-gray-800">{user.name || "User"}</p>
                        <p className="text-xs text-gray-400">{user.email}</p>
                      </td>
                      <td className="p-6">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase shadow-sm
                          ${user.role === 'admin' ? 'bg-purple-100 text-purple-600' : 
                            user.role === 'seller' ? 'bg-blue-100 text-blue-600' : 
                            'bg-gray-100 text-gray-600'}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="p-6">
                        <select 
                          value={user.role}
                          onChange={(e) => handleUpdateRole(user._id, e.target.value)}
                          className="bg-gray-50 border border-gray-200 text-gray-700 text-xs font-bold rounded-xl p-2 cursor-pointer hover:bg-white transition-all outline-none w-32"
                        >
                          <option value="customer">Customer</option>
                          <option value="seller">Seller</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="p-6 text-center">
                        <button 
                          onClick={() => handleDeleteUser(user._id)}
                          className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors"
                          title="Delete User"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Analytics Section */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100">
            <h2 className="text-xl font-black mb-6 text-gray-800">Sales Analytics 📈</h2>
            <div className="w-full" style={{ height: '300px' }}>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
                    <Tooltip cursor={{fill: '#f9fafb'}} contentStyle={{borderRadius: '15px', border: 'none'}} />
                    <Bar dataKey="sales" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 text-sm italic text-center">
                  Not enough sales data to show analytics
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color, bg }) {
  return (
    <div className="bg-white p-6 rounded-[2.2rem] shadow-sm border border-gray-100 flex items-center justify-between transition-transform hover:scale-105">
      <div>
        <p className="text-gray-500 text-xs font-bold mb-1">{title}</p>
        <h3 className="text-2xl font-black text-gray-900">{value}</h3>
      </div>
      <div className={`w-14 h-14 rounded-2xl ${bg} ${color} flex items-center justify-center text-2xl`}>
        {icon}
      </div>
    </div>
  );
}