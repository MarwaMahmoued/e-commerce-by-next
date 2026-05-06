"use client";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);


  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      setOrders(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching orders:", err);
      toast.error("Failed to load orders");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await fetch("/api/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, newStatus }),
      });

      if (res.ok) {
        toast.success("Order status updated successfully ✅");
        fetchOrders(); 
      } else {
        const data = await res.json();
        toast.error(data.error || "Update failed");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("An error occurred during update");
    }
  };

  if (loading) return <div className="p-20 text-center font-bold text-blue-600">Loading Orders... 📦</div>;

  return (
    <div className="max-w-7xl mx-auto p-8" dir="ltr">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Manage Orders 📦</h1>
          <p className="text-gray-500 mt-1">Track shipping and delivery status here</p>
        </div>
        <div className="text-sm bg-blue-50 text-blue-600 px-6 py-3 rounded-2xl font-bold border border-blue-100">
          Total Orders: {orders.length}
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="p-6 text-gray-400 font-bold text-sm">Customer / Address</th>
              <th className="p-6 text-gray-400 font-bold text-sm">Products</th>
              <th className="p-6 text-gray-400 font-bold text-sm">Total Amount</th>
              <th className="p-4 text-gray-400 font-bold text-sm text-center">Update Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {orders.map((order) => (
              <tr key={order._id} className="hover:bg-gray-50/50 transition-all group">
                <td className="p-6">
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-800">
                      {order.shippingAddress?.city || "N/A"}
                    </span>
                    <span className="text-xs text-gray-400">
                      {order.shippingAddress?.phone || "No Phone"}
                    </span>
                  </div>
                </td>
                <td className="p-6">
                  <div className="flex flex-col gap-1">
                    {order.orderItems?.map((item, idx) => (
                      <span key={idx} className="text-[11px] text-gray-600 bg-gray-100 px-2 py-1 rounded-lg w-fit">
                        {item.name} <span className="text-blue-500 font-bold">×{item.quantity}</span>
                      </span>
                    ))}
                  </div>
                </td>
                <td className="p-6">
                  <span className="text-xl font-black text-gray-900">${order.totalPrice}</span>
                </td>
                <td className="p-6 text-center">
                  <select
                    value={order.orderStatus || "Processing"}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border-none outline-none cursor-pointer transition-colors shadow-sm ${
                      order.orderStatus === "Delivered" 
                      ? "bg-green-100 text-green-600" 
                      : order.orderStatus === "Cancelled"
                      ? "bg-red-100 text-red-600"
                      : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    <option value="Processing">Processing ⏳</option>
                    <option value="Shipped">Shipped 🚚</option>
                    <option value="Delivered">Delivered ✅</option>
                    <option value="Cancelled">Cancelled ❌</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && (
          <div className="p-20 text-center text-gray-400 italic">No orders available to display</div>
        )}
      </div>
    </div>
  );
}