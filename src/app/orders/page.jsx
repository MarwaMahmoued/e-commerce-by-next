"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronUp, RefreshCcw, User, Calendar } from "lucide-react";

export default function MyOrdersPage() {
    const { data: session, status } = useSession();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrder, setExpandedOrder] = useState(null);
    const router = useRouter();

    const getStatusStyle = (status) => {
        switch (status) {
            case "Delivered": return "bg-green-100 text-green-700 border-green-200";
            case "Cancelled": return "bg-red-100 text-red-700 border-red-200";
            case "Shipped": return "bg-orange-100 text-orange-700 border-orange-200";
            case "Processing": return "bg-blue-100 text-blue-700 border-blue-200";
            default: return "bg-gray-100 text-gray-700 border-gray-200";
        }
    };

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        } else if (status === "authenticated") {
            fetchOrders();
        }
    }, [status]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/orders");
            const data = await res.json();
            if (res.ok) setOrders(data);
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (orderId, newStatus) => {
        try {
            const res = await fetch(`/api/orders/${orderId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderStatus: newStatus }),
            });
            if (res.ok) {
                fetchOrders(); 
            }
        } catch (error) {
            console.error("Update failed");
        }
    };

    if (loading) return <div className="text-center p-20 animate-pulse font-bold text-[#0a192f]">your orders are loading...</div>;

    const isAdmin = session?.user?.role === "admin" || session?.user?.role === "seller";

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-8" dir="ltr">
            <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm flex justify-between items-center">
                <div>
                    <span className="text-blue-600 uppercase tracking-widest text-[10px] font-black">Control Panel</span>
                    <h1 className="text-4xl font-bold text-[#0a192f]">Orders Management</h1>
                    <p className="text-gray-400 mt-2 text-sm">Review all customer transactions and shipping updates.</p>
                </div>
                <button onClick={fetchOrders} className="bg-[#0a192f] text-white p-4 rounded-2xl hover:bg-blue-600 transition-all flex gap-2">
                    <RefreshCcw size={20} /> Refresh
                </button>
            </div>

            <div className="space-y-4">
                {orders.map((order) => (
                    <div key={order._id} className="bg-white border border-gray-50 rounded-[2.5rem] p-6 shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <div className="flex gap-6 items-center flex-wrap">
                              

                                <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-xl">
                                    <div>
                                        <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-tighter">Order #</span>
                                        <span className="font-mono text-xs font-bold uppercase">{order._id.slice(-8)}</span>
                                    </div>
                                    <div className="w-[1px] h-8 bg-gray-200 mx-2"></div>
                                    <div>
                                        <span className="text-[10px] text-gray-400 font-bold block uppercase">Customer</span>
                                        <span className="text-xs font-bold text-blue-600 flex items-center gap-1">
                                            <User size={12}/> {order.user?.name || "Guest User"}
                                        </span>
                                    </div>
                                </div>

                               
                                <div>
                                    <div className="text-2xl font-black text-[#0a192f]">${order.totalPrice?.toFixed(2)}</div>
                                    <div className="text-[10px] text-gray-400 font-bold flex items-center gap-1">
                                        <Calendar size={10}/> {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </div>
                                </div>
                                
                                <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase border ${getStatusStyle(order.orderStatus)}`}>
                                    {order.orderStatus}
                                </span>
                            </div>

                            <div className="flex items-center gap-4">
                                {isAdmin && (
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase">Update Status</span>
                                        <select 
                                            value={order.orderStatus}
                                            onChange={(e) => updateStatus(order._id, e.target.value)}
                                            className="bg-gray-100 border-none rounded-xl text-xs font-bold p-2 focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="Processing">Processing</option>
                                            <option value="Shipped">Shipped</option>
                                            <option value="Delivered">Delivered</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>
                                    </div>
                                )}
                                
                                <button 
                                    onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                                    className="bg-[#0a192f] text-white px-6 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:shadow-lg transition-all"
                                >
                                    {expandedOrder === order._id ? (
                                        <>Hide <ChevronUp size={16}/></>
                                    ) : (
                                        <>Details <ChevronDown size={16}/></>
                                    )}
                                </button>
                            </div>
                        </div>

                      
                        {expandedOrder === order._id && (
                            <div className="mt-8 pt-8 border-t border-dashed border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-8 animate-in fade-in slide-in-from-top-4 duration-500">
                                <div className="space-y-4">
                                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Items Purchased</h3>
                                    {order.orderItems.map((item, idx) => (
                                        <div key={idx} className="flex items-center justify-between bg-gray-50 p-3 rounded-2xl border border-gray-100">
                                            <div className="flex items-center gap-3">
                                              
                                                <img 
                                                    src={item.product?.images?.[0] || item.image || "/placeholder.png"} 
                                                    className="w-12 h-12 rounded-xl object-cover border border-white shadow-sm" 
                                                    alt={item.product?.name || item.name} 
                                                />
                                                <div>
                                                   
                                                    <p className="font-bold text-xs text-[#0a192f] leading-tight">
                                                        {item.product?.name || item.name}
                                                    </p>
                                                    <p className="text-[10px] text-gray-400 font-bold">QTY: {item.quantity} × ${item.price}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="bg-gray-50 p-6 rounded-[2rem] space-y-5 border border-gray-100">
                                    <div>
                                        <h3 className="text-[10px] font-black text-blue-600 uppercase mb-3">📍 Delivery Info</h3>
                                        <p className="text-xs font-bold text-gray-400 uppercase">Address</p>
                                        <p className="text-sm font-bold text-[#0a192f]">{order.shippingAddress?.address || "No address provided"}</p>
                                        <p className="text-xs text-gray-500 mt-1">{order.shippingAddress?.city} | 📞 {order.shippingAddress?.phone}</p>
                                    </div>
                                    <div className="pt-4 border-t border-gray-200">
                                        <h3 className="text-[10px] font-black text-blue-600 uppercase mb-2">💳 Payment Method</h3>
                                        <p className="text-sm font-bold text-[#0a192f] uppercase">{order.paymentMethod}</p>
                                        <div className="mt-2">
                                            {order.isPaid ? (
                                                <span className="text-[9px] bg-green-500 text-white px-2 py-1 rounded font-black">PAID AT: {new Date(order.paidAt).toLocaleDateString()}</span>
                                            ) : (
                                                <span className="text-[9px] bg-red-500 text-white px-2 py-1 rounded font-black">UNPAID</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-[#0a192f] p-6 rounded-[2rem] text-white shadow-xl shadow-blue-900/20">
                                    <h3 className="text-[10px] font-bold text-blue-300 uppercase mb-4 tracking-widest">Financial Summary</h3>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between text-slate-400">
                                            <span>Subtotal</span>
                                            <span className="font-bold">${order.itemsPrice?.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-slate-400">
                                            <span>Tax</span>
                                            <span className="font-bold">${order.taxPrice?.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-slate-400">
                                            <span>Shipping</span>
                                            <span className="font-bold">${order.shippingPrice?.toFixed(2)}</span>
                                        </div>
                                        <div className="pt-4 border-t border-slate-700 flex justify-between items-baseline">
                                            <span className="font-bold text-xs uppercase tracking-widest text-blue-300">Grand Total</span>
                                            <span className="text-3xl font-black text-blue-400">${order.totalPrice?.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}