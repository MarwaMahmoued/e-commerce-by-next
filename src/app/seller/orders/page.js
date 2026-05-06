"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function SellerOrders() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.id) {
      fetch(`/api/orders?sellerId=${session.user.id}`)
        .then((res) => res.json())
        .then((data) => {
          setOrders(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Fetch error:", err);
          setLoading(false);
        });
    }
  }, [session]);

  if (loading) {
    return (
      <div className="p-20 text-center font-bold text-purple-600">
        Loading your orders... 
              </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-8" dir="ltr">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Seller Orders 🏪</h1>
          <p className="text-gray-500 text-sm mt-1">
            Displaying orders containing your products only
          </p>
        </div>
        <div className="text-sm bg-purple-50 text-purple-600 px-4 py-2 rounded-xl font-bold">
          Total Orders: {orders.length}
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="p-6 text-gray-400 font-bold text-sm uppercase">Customer / Address</th>
              <th className="p-6 text-gray-400 font-bold text-sm uppercase">Ordered Items</th>
              <th className="p-6 text-gray-400 font-bold text-sm uppercase">Total Price</th>
              <th className="p-4 text-gray-400 font-bold text-sm uppercase text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50/50 transition-all group">
                  <td className="p-6">
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-800">
                        {order.shippingAddress?.city || "Not Specified"}
                      </span>
                      <span className="text-xs text-gray-400">
                        {order.shippingAddress?.phone}
                      </span>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex flex-col gap-1">
                      {order.orderItems?.map((item, idx) => (
                        <span key={idx} className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-lg w-fit">
                          {item.name} <span className="text-purple-500 font-bold">×{item.quantity}</span>
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-6">
                    <span className="text-xl font-black text-gray-900">${order.totalPrice}</span>
                  </td>
                  <td className="p-6 text-center">
                    <span className={`px-4 py-2 rounded-xl text-xs font-bold ${
                      order.orderStatus === "Delivered" 
                      ? "bg-green-100 text-green-600" 
                      : "bg-purple-100 text-purple-600"
                    }`}>
                      {order.orderStatus || "Processing"}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-10 text-center text-gray-400 italic">
                  No orders found for your products.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}