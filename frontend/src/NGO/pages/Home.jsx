import React, { useEffect, useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { 
  FiClock, FiUser, FiMapPin, FiPackage, 
  FiLogOut, FiCheckCircle, FiTruck, FiActivity, 
  FiTrendingUp, FiAward, FiCalendar, FiSearch,
  FiFilter, FiArrowRight, FiInfo
} from "react-icons/fi";
import toast from "react-hot-toast";
import axios from "axios";

const Home = () => {
  const { user, logout } = useContext(AuthContext);

  const [orders, setOrders] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedVolunteer, setSelectedVolunteer] = useState("");
  const [stats, setStats] = useState({ pending: 0, accepted: 0, completed: 0 });
  const [leaderboard, setLeaderboard] = useState(null);
  const [recentDonations, setRecentDonations] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [ordersRes, volunteersRes, leaderboardRes, historyRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/order/ngo/orders`, { withCredentials: true }),
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/volunteers`, { withCredentials: true }),
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/leaderboard`),
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/order/ngo/history`, { withCredentials: true })
      ]);

      setOrders(ordersRes.data.orders || []);
      setVolunteers(volunteersRes.data.volunteers || []);
      setLeaderboard(leaderboardRes.data.leaderboard);
      setRecentDonations((historyRes.data.orders || []).slice(0, 5));
      
      const counts = (ordersRes.data.orders || []).reduce((acc, order) => {
        const s = order.status.toLowerCase();
        acc[s] = (acc[s] || 0) + 1;
        return acc;
      }, { pending: 0, accepted: 0, completed: 0 });
      setStats(counts);
    } catch (err) {
      console.error("NGO Data Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptOrder = async () => {
    if (!selectedVolunteer) return toast.error("Please select a volunteer!");
    try {
      const { data } = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/order/accept`,
        {
          orderId: selectedOrder._id,
          volunteerId: selectedVolunteer,
          userId: user?._id || user?.id
        },
        { withCredentials: true }
      );
      if (data.success) {
        toast.success("Volunteer assigned successfully!");
        setSelectedOrder(null);
        fetchData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to accept order");
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex overflow-hidden">
      {/* Sidebar */}
      <aside className="w-72 bg-emerald-900 text-white flex flex-col shrink-0 hidden lg:flex">
        <div className="p-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
              <FiPackage className="text-white text-xl" />
            </div>
            <h1 className="text-2xl font-black tracking-tighter uppercase">FoodBridge</h1>
          </div>
          <p className="text-emerald-400 text-[10px] font-black uppercase tracking-widest px-1">NGO Command Center</p>
        </div>

        <nav className="flex-1 px-6 space-y-2">
          <button className="w-full flex items-center gap-3 px-6 py-4 bg-emerald-800 rounded-2xl text-white font-bold transition-all shadow-lg">
            <FiActivity /> Dashboard
          </button>
          <button onClick={() => navigate("/ngo/history")} className="w-full flex items-center gap-3 px-6 py-4 text-emerald-300 hover:bg-emerald-800 hover:text-white rounded-2xl font-bold transition-all">
            <FiClock /> History
          </button>
          <button onClick={() => navigate("/profile")} className="w-full flex items-center gap-3 px-6 py-4 text-emerald-300 hover:bg-emerald-800 hover:text-white rounded-2xl font-bold transition-all">
            <FiUser /> Profile
          </button>
        </nav>

        <div className="p-8 mt-auto border-t border-emerald-800">
          <div className="flex items-center gap-4 mb-6 px-2">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center font-black text-xl shadow-lg">
              {user?.firstName?.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="font-black truncate text-sm">{user?.firstName} {user?.lastName}</p>
              <p className="text-[10px] text-emerald-400 font-black uppercase tracking-widest">Verified NGO</p>
            </div>
          </div>
          <button onClick={logout} className="w-full flex items-center justify-center gap-2 py-4 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-2xl font-black transition-all active:scale-95 shadow-lg">
            <FiLogOut /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6 lg:p-12">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
          <div>
            <h2 className="text-4xl font-black text-gray-900 tracking-tight">Mission Overview</h2>
            <p className="text-gray-500 font-bold mt-1 italic">"Serving humanity, one meal at a time."</p>
          </div>
          
          <div className="flex flex-wrap gap-4 w-full md:w-auto">
            {[
              { label: "Pending", value: stats.pending, icon: <FiClock />, color: "text-amber-500", bg: "bg-amber-50" },
              { label: "Active", value: stats.accepted, icon: <FiTruck />, color: "text-blue-500", bg: "bg-blue-50" },
              { label: "Delivered", value: stats.completed, icon: <FiCheckCircle />, color: "text-emerald-500", bg: "bg-emerald-50" },
            ].map((stat, i) => (
              <div key={i} className="bg-white px-6 py-4 rounded-[1.5rem] shadow-xl shadow-gray-100 border border-gray-50 flex items-center gap-4 flex-1 md:flex-none min-w-[140px]">
                <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center text-xl shadow-sm`}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{stat.label}</p>
                  <p className="text-2xl font-black text-gray-900 leading-none">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
          {/* Incoming Requests */}
          <div className="xl:col-span-2 space-y-10">
            <section className="bg-white rounded-[3rem] shadow-2xl shadow-gray-100 overflow-hidden border border-gray-100">
              <div className="p-10 border-b border-gray-50 flex justify-between items-center">
                <h3 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                  <FiActivity className="text-emerald-500" /> Live Requests
                </h3>
                <span className="px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse">
                  System Active
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                      <th className="px-10 py-6">Donor Profile</th>
                      <th className="px-10 py-6">Donation Details</th>
                      <th className="px-10 py-6">Status</th>
                      <th className="px-10 py-6 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {loading ? (
                      [1,2,3].map(i => <tr key={i}><td colSpan="4" className="px-10 py-10"><div className="h-10 bg-gray-50 animate-pulse rounded-2xl"></div></td></tr>)
                    ) : orders.length === 0 ? (
                      <tr><td colSpan="4" className="px-10 py-24 text-center text-gray-400 font-black italic text-xl">No pending requests in your area.</td></tr>
                    ) : (
                      orders.map((order) => (
                        <tr key={order._id} className="hover:bg-emerald-50/30 transition-all group">
                          <td className="px-10 py-8">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 font-black text-xl shadow-sm">
                                {order.userId?.firstName?.charAt(0) || "D"}
                              </div>
                              <div>
                                <p className="font-black text-gray-900 leading-tight">{order.userId?.firstName || "Anonymous"}</p>
                                <p className="text-xs text-gray-400 font-bold mt-0.5">{order.pincode}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-10 py-8">
                            <div className="flex flex-col">
                              <span className="font-black text-gray-800 leading-tight">{order.foodDetails}</span>
                              <span className="text-xs text-emerald-600 font-black mt-1 uppercase tracking-widest">{order.quantity} Servings</span>
                            </div>
                          </td>
                          <td className="px-10 py-8">
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-1.5 ${
                              order.status === "Pending" ? "bg-amber-100 text-amber-600" :
                              order.status === "Accepted" ? "bg-blue-100 text-blue-600" :
                              "bg-emerald-100 text-emerald-600"
                            }`}>
                              <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-10 py-8 text-right">
                            <button
                              onClick={() => setSelectedOrder(order)}
                              className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-black text-xs shadow-lg shadow-emerald-100 hover:bg-emerald-700 hover:scale-105 active:scale-95 transition-all"
                            >
                              Assign Hero
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Recent Activity Table */}
            <section className="bg-white rounded-[3rem] shadow-2xl shadow-gray-100 overflow-hidden border border-gray-100">
              <div className="p-10 border-b border-gray-50 flex justify-between items-center">
                <h3 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                  <FiClock className="text-blue-500" /> Recent Activity
                </h3>
                <button onClick={() => navigate("/ngo/history")} className="text-emerald-600 font-black text-xs uppercase tracking-widest hover:underline">View All</button>
              </div>
              <div className="p-10 space-y-6">
                {recentDonations.map((h, i) => (
                  <div key={i} className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl border border-transparent hover:border-blue-100 transition-all group">
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-blue-500 shadow-sm group-hover:scale-110 transition-transform">
                        <FiCheckCircle className="text-2xl" />
                      </div>
                      <div>
                        <p className="font-black text-gray-900 leading-tight">{h.foodDetails}</p>
                        <p className="text-xs text-gray-400 font-bold mt-1">Delivered by {h.volunteerId?.firstName || "Volunteer"}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-black text-blue-600 uppercase tracking-widest mb-1">Impact Made</p>
                      <p className="text-sm font-bold text-gray-500">{new Date(h.updatedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Sidebar - Stats & Leaderboard */}
          <div className="space-y-10">
            {/* Efficiency Card */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-800 rounded-[3rem] p-10 text-white shadow-2xl shadow-blue-200 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              <div className="relative z-10">
                <FiTrendingUp className="text-4xl text-blue-200 mb-6" />
                <h4 className="text-2xl font-black mb-2">Efficiency Peak</h4>
                <p className="text-blue-100 text-sm font-bold leading-relaxed mb-8">
                  Your NGO's distribution speed has improved by <span className="text-white text-lg">24%</span> this week.
                </p>
                <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: "94%" }}
                    transition={{ duration: 1.5 }}
                    className="bg-white h-full rounded-full"
                  />
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest mt-3 opacity-60">94% Target Achieved</p>
              </div>
            </div>

            {/* Top Donors Leaderboard */}
            <div className="bg-white rounded-[3rem] p-10 shadow-2xl shadow-gray-100 border border-gray-100">
              <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-3">
                <FiAward className="text-amber-500 text-2xl" /> Top Donors
              </h3>
              <div className="space-y-6">
                {leaderboard?.topDonors?.slice(0, 5).map((donor, idx) => (
                  <div key={idx} className="flex items-center justify-between group cursor-default">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shadow-sm transition-all group-hover:scale-110 ${
                        idx === 0 ? "bg-amber-400 text-white" : "bg-gray-50 text-gray-400"
                      }`}>
                        {idx + 1}
                      </div>
                      <div>
                        <p className="font-black text-gray-800 text-sm leading-tight">{donor.name}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Contributor</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-emerald-600 text-sm">₹{donor.totalAmount.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-white rounded-[3rem] p-10 border-2 border-dashed border-gray-200">
              <FiInfo className="text-3xl text-emerald-500 mb-4" />
              <h4 className="text-lg font-black text-gray-800 mb-2">Pro Tip!</h4>
              <p className="text-sm text-gray-500 font-medium leading-relaxed">
                Respond to requests within <span className="text-emerald-600 font-bold">15 minutes</span> to maintain high donor satisfaction ratings.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Volunteer Assignment Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="absolute inset-0 bg-emerald-950/60 backdrop-blur-md"
            ></motion.div>
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 40 }}
              className="relative bg-white w-full max-w-2xl rounded-[4rem] shadow-2xl overflow-hidden"
            >
              <div className="p-12 md:p-16">
                <div className="flex justify-between items-start mb-10">
                  <div>
                    <h3 className="text-3xl font-black text-gray-900 mb-2">Assign Delivery Hero</h3>
                    <p className="text-gray-500 font-bold">Selecting a volunteer for pickup at <span className="text-emerald-600">{selectedOrder.address}</span></p>
                  </div>
                  <button onClick={() => setSelectedOrder(null)} className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors">
                    <FiLogOut className="rotate-180" />
                  </button>
                </div>

                <div className="space-y-4 mb-12 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                  {volunteers.length === 0 ? (
                    <div className="text-center py-20 text-gray-400 font-black italic">No active volunteers found in this sector.</div>
                  ) : (
                    volunteers.map((v) => (
                      <label
                        key={v._id}
                        className={`flex items-center justify-between p-6 rounded-3xl border-2 transition-all cursor-pointer group ${
                          selectedVolunteer === v._id
                            ? "border-emerald-500 bg-emerald-50 shadow-xl shadow-emerald-100/50"
                            : "border-gray-100 hover:border-emerald-200"
                        }`}
                      >
                        <div className="flex items-center gap-6">
                          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-black text-2xl transition-colors ${
                            selectedVolunteer === v._id ? "bg-emerald-500 text-white" : "bg-emerald-100 text-emerald-600"
                          }`}>
                            {v.firstName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-black text-gray-900 text-lg">{v.firstName} {v.lastName}</p>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">{v.phone}</p>
                          </div>
                        </div>
                        <input
                          type="radio"
                          name="volunteer"
                          value={v._id}
                          className="hidden"
                          onChange={(e) => setSelectedVolunteer(e.target.value)}
                        />
                        <div className={`w-8 h-8 rounded-full border-4 flex items-center justify-center transition-all ${
                          selectedVolunteer === v._id ? "border-emerald-500 scale-110" : "border-gray-200"
                        }`}>
                          {selectedVolunteer === v._id && <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>}
                        </div>
                      </label>
                    ))
                  )}
                </div>

                <div className="flex gap-6">
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="flex-1 py-5 bg-gray-100 text-gray-500 font-black text-xl rounded-[2rem] hover:bg-gray-200 transition-all active:scale-95"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAcceptOrder}
                    disabled={!selectedVolunteer}
                    className="flex-[2] py-5 bg-emerald-600 text-white font-black text-xl rounded-[2rem] shadow-2xl shadow-emerald-200 hover:bg-emerald-700 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
                  >
                    Confirm Assignment <FiArrowRight />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;
