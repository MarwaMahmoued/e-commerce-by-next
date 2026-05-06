"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRoleLoading, setIsRoleLoading] = useState(false);
  const [userRole, setUserRole] = useState(""); 
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    image: "",
    address: {
      city: "",
      street: "",
      country: ""
    },
  });

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");

    if (status === "authenticated" && session?.user) {
      setUserRole(session.user.role || "customer"); 
      setFormData({
        name: session.user.name || "",
        phone: session.user.phone || "",
        image: session.user.image || "",
        address: {
          city: session.user.address?.city || "",
          street: session.user.address?.street || "",
          country: session.user.address?.country || ""
        }
      });   

      fetch(`/api/orders?userId=${session.user.id}`)
        .then((res) => res.json())
        .then((data) => {
          setOrders(data || []);
          setLoading(false);
        }).catch(() => setLoading(false));
    }
  }, [status, session]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData({ ...formData, image: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      const res = await fetch("/api/users/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success("Profile updated successfully!");
        await update({
          ...session,
          user: {
            ...session.user,
            name: formData.name,
            phone: formData.phone,
            address: formData.address
          }
        });
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleBecomeSeller = async () => {
    setIsRoleLoading(true);
    const loadingToast = toast.loading("Upgrading your account to Seller...");
    
    try {
      const res = await fetch("/api/users/become-seller", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" }
      });

      const data = await res.json();

      if (data.success) {
        toast.success(data.message, { id: loadingToast });
        
     
        setUserRole("seller");

        await update({
          ...session,
          user: { ...session.user, role: "seller" }
        });

     
        setTimeout(() => {
          router.push("/seller/dashboard");
          router.refresh();
        }, 2000);

      } else {
        toast.error(data.message || "Failed to upgrade account", { id: loadingToast });
      }
    } catch (error) {
      toast.error("Error updating role", { id: loadingToast });
    } finally {
      setIsRoleLoading(false);
    }
  };

  if (status === "loading" || loading) return <div className="text-center p-20 font-bold text-blue-600">Loading Dashboard...</div>;

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-12 font-sans" dir="ltr">
      <h1 className="text-4xl font-black text-gray-900 mb-10">User Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-[2.5rem] shadow-xl p-8 border border-gray-50 text-center relative overflow-hidden">
            <div className="relative w-32 h-32 mx-auto mb-4 group">
              <img 
                src={formData.image || "https://ui-avatars.com/api/?name=" + formData.name} 
                className="w-full h-full rounded-full object-cover border-4 border-blue-50"
              />
              <label className="absolute inset-0 flex items-center justify-center bg-black/40 text-white rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-all">
                <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                <span className="text-xs font-bold">Change Image</span>
              </label>
            </div>
            
            <h2 className="text-2xl font-black text-gray-800">{formData.name}</h2>
            <p className="text-gray-400 text-sm mb-4">{session?.user?.email}</p>
            
            <div className="flex justify-center gap-2">
              <span className="bg-blue-50 text-blue-600 px-4 py-1 rounded-full text-[10px] font-black uppercase">
                {userRole} 
              </span>
            </div>
          </div>

          <div className="bg-gray-50 rounded-[2rem] p-6 space-y-4">
            <h3 className="font-bold text-gray-700">Account Settings</h3>
            <input 
              type="text" value={formData.name} placeholder="Full Name"
              className="w-full p-3 rounded-xl border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
            <input 
              type="text" value={formData.phone} placeholder="Phone Number"
              className="w-full p-3 rounded-xl border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />

            <h3 className="font-bold text-gray-700 mt-4">Address Details</h3>
            <div className="grid grid-cols-2 gap-2">
                <input 
                  type="text" value={formData.address.city} placeholder="City"
                  className="w-full p-3 rounded-xl border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => setFormData({...formData, address: {...formData.address, city: e.target.value}})}
                />
                <input 
                  type="text" value={formData.address.country} placeholder="Country"
                  className="w-full p-3 rounded-xl border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => setFormData({...formData, address: {...formData.address, country: e.target.value}})}
                />
            </div>
            
            <button 
              onClick={handleUpdate} disabled={isUpdating}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-gray-900 transition-all"
            >
              {isUpdating ? "Saving..." : "Save Changes"}
            </button>

           
            {userRole === "customer" && (
                <button 
                  onClick={handleBecomeSeller}
                  disabled={isRoleLoading}
                  className="w-full bg-purple-600 text-white py-3 rounded-xl font-bold hover:bg-purple-700 transition-all mt-2"
                >
                  {isRoleLoading ? "Processing..." : "🚀 Become a Seller"}
                </button>
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8">
            <h2 className="text-2xl font-black text-gray-800 mb-8">Order History 🛍️</h2>
            {orders.length === 0 ? (
              <div className="text-center py-20 text-gray-300">No orders found yet.</div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order._id} className="group flex items-center justify-between p-5 rounded-2xl border border-gray-50 hover:bg-blue-50/50 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm font-bold text-blue-600">
                        #{order._id.slice(-4)}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 text-sm">{order.orderItems?.length} Products</p>
                        <p className="text-[10px] text-gray-400">{new Date(order.createdAt).toDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-gray-900">${order.totalPrice}</p>
                      <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${
                        order.orderStatus === "Delivered" ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600"
                      }`}>
                        {order.orderStatus}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}