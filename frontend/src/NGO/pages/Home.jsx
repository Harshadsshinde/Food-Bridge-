import React, { useEffect, useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { FiClock, FiUser, FiMapPin, FiPackage, FiLogOut, FiCheckCircle, FiTruck, FiActivity, FiTrendingUp } from "react-icons/fi";
import toast from "react-hot-toast";
import axios from "axios";
import { FiAward } from "react-icons/fi";

const Home = () => {
  const { user, logout } = useContext(AuthContext);

  const [orders, setOrders] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedVolunteer, setSelectedVolunteer] = useState("");
  const [stats, setStats] = useState({ pending: 0, accepted: 0, completed: 0 });
  const [leaderboard, setLeaderboard] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [ordersRes, volunteersRes, leaderboardRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/order/ngo/orders`, { withCredentials: true }),
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/volunteers`, { withCredentials: true }),
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/leaderboard`)
      ]);

      setOrders(ordersRes.data.orders);
      setVolunteers(volunteersRes.data.volunteers);
      setLeaderboard(leaderboardRes.data.leaderboard);
      
      // Calculate simple stats
      const counts = ordersRes.data.orders.reduce((acc, order) => {
        const s = order.status.toLowerCase();
        acc[s] = (acc[s] || 0) + 1;
        return acc;
      }, { pending: 0, accepted: 0, completed: 0 });
      setStats(counts);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch data");
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
        toast.success("Order accepted and volunteer assigned!");
        setSelectedOrder(null);
        fetchData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to accept order");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-emerald-900 text-white flex flex-col hidden md:flex">
        <div className="p-8">
          <h1 className="text-2xl font-black tracking-tighter flex items-center gap-2">
            <FiPackage className="text-emerald-400" /> FOODSHARE
          </h1>
          <p className="text-emerald-400 text-xs font-bold mt-1 uppercase tracking-widest">NGO Dashboard</p>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-emerald-800 rounded-xl text-white font-bold transition-all">
            <FiActivity /> Overview
          </button>
          <button onClick={() => navigate("/ngo/history")} className="w-full flex items-center gap-3 px-4 py-3 text-emerald-300 hover:bg-emerald-800 hover:text-white rounded-xl font-bold transition-all">
            <FiClock /> History
          </button>
          <button onClick={() => navigate("/profile")} className="w-full flex items-center gap-3 px-4 py-3 text-emerald-300 hover:bg-emerald-800 hover:text-white rounded-xl font-bold transition-all">
            <FiUser /> Profile
          </button>
        </nav>

        <div className="p-6 border-t border-emerald-800">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center font-bold">
              {user?.firstName?.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="font-bold truncate">{user?.firstName}</p>
              <p className="text-xs text-emerald-400 truncate">Verified NGO</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 py-3 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-xl font-bold transition-all">
            <FiLogOut /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6">
          <div>
            <h2 className="text-3xl font-black text-gray-900">NGO Dashboard</h2>
            <p className="text-gray-500">Coordinate donations and volunteer assignments efficiently.</p>
          </div>
          <div className="flex gap-4 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 min-w-[140px] flex-1">
              <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500 text-xl">
                <FiClock />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase">Pending</p>
                <p className="text-xl font-black text-gray-900">{stats.pending}</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 min-w-[140px] flex-1">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500 text-xl">
                <FiTruck />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase">Active</p>
                <p className="text-xl font-black text-gray-900">{stats.accepted}</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 min-w-[140px] flex-1">
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500 text-xl">
                <FiCheckCircle />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase">Success</p>
                <p className="text-xl font-black text-gray-900">{stats.completed}</p>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Main Table Section */}
          <div className="xl:col-span-2 space-y-8">
            <section className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-gray-100">
              <div className="p-8 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                  <FiActivity className="text-emerald-500" /> Donation Requests
                </h3>
                <span className="bg-emerald-50 text-emerald-600 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">
                  Live
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50 text-gray-400 text-xs font-black uppercase tracking-widest">
                      <th className="px-8 py-4">Donor</th>
                      <th className="px-8 py-4">Items</th>
                      <th className="px-8 py-4">Status</th>
                      <th className="px-8 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {loading ? (
                      [...Array(3)].map((_, i) => (
                        <tr key={i}>
                          <td colSpan="4" className="px-8 py-10">
                            <div className="h-8 bg-gray-50 animate-pulse rounded-xl w-full"></div>
                          </td>
                        </tr>
                      ))
                    ) : orders.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="px-8 py-20 text-center text-gray-400 font-bold">
                          No donation requests found at the moment.
                        </td>
                      </tr>
                    ) : (
                      orders.map((order) => (
                        <tr key={order._id} className="hover:bg-gray-50 transition-colors group">
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold">
                                {order.userId?.firstName?.charAt(0) || "D"}
                              </div>
                              <div>
                                <p className="font-bold text-gray-900">{order.userId?.firstName || "Anonymous Donor"}</p>
                                <p className="text-xs text-gray-400">{new Date(order.requestedAt).toLocaleDateString()}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex flex-col">
                              <span className="font-bold text-gray-700 truncate max-w-[150px]">{order.foodDetails}</span>
                              <span className="text-xs text-gray-400">{order.quantity} units</span>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                              order.status === "Pending" ? "bg-amber-100 text-amber-600" :
                              order.status === "Accepted" ? "bg-blue-100 text-blue-600" :
                              order.status === "Completed" ? "bg-emerald-100 text-emerald-600" :
                              "bg-red-100 text-red-600"
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-8 py-6 text-right">
                            {order.status === "Pending" ? (
                              <button
                                onClick={() => setSelectedOrder(order)}
                                className="bg-emerald-500 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-lg hover:bg-emerald-600 transition-all active:scale-95"
                              >
                                Assign
                              </button>
                            ) : (
                              <button className="text-gray-400 font-bold flex items-center gap-1 ml-auto text-sm">
                                <FiActivity />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          {/* Sidebar Section */}
          <div className="space-y-8">
            {/* Top Donors Card */}
            <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-gray-100">
              <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                <FiAward className="text-amber-500" /> Top Contributors
              </h3>
              <div className="space-y-4">
                {leaderboard?.topDonors?.slice(0, 3).map((donor, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center font-bold text-emerald-600">
                        {idx + 1}
                      </div>
                      <p className="font-bold text-gray-800 text-sm truncate max-w-[80px]">{donor.name}</p>
                    </div>
                    <p className="font-black text-emerald-600 text-sm">₹{donor.totalAmount.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Analytics Card */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden">
              <div className="relative z-10">
                <FiTrendingUp className="text-3xl text-blue-300 mb-4" />
                <h4 className="text-xl font-bold mb-2">Efficiency Rate</h4>
                <p className="text-blue-100 text-sm leading-relaxed mb-4">
                  Your NGO has a 94% success rate in food distribution this month. Keep it up!
                </p>
                <div className="w-full bg-blue-900/40 rounded-full h-2">
                  <div className="bg-white w-[94%] h-full rounded-full"></div>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
            </div>
          </div>
        </div>
      </main>

      {/* Assign Volunteer Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="absolute inset-0 bg-emerald-950/40 backdrop-blur-sm"
            ></motion.div>
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden p-10"
            >
              <h3 className="text-2xl font-black text-gray-900 mb-2">Assign a Volunteer</h3>
              <p className="text-gray-500 mb-8">Choose a volunteer to pick up the donation from {selectedOrder.address}.</p>

              <div className="space-y-4 mb-10">
                {volunteers.length === 0 ? (
                  <p className="text-center py-10 text-gray-400">No active volunteers found in your area.</p>
                ) : (
                  volunteers.map((v) => (
                    <label
                      key={v._id}
                      className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                        selectedVolunteer === v._id
                          ? "border-emerald-500 bg-emerald-50"
                          : "border-gray-100 hover:border-emerald-200"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center font-bold text-emerald-700">
                          {v.firstName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{v.firstName} {v.lastName}</p>
                          <p className="text-xs text-gray-400">{v.phone}</p>
                        </div>
                      </div>
                      <input
                        type="radio"
                        name="volunteer"
                        value={v._id}
                        className="hidden"
                        onChange={(e) => setSelectedVolunteer(e.target.value)}
                      />
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedVolunteer === v._id ? "border-emerald-500" : "border-gray-200"
                      }`}>
                        {selectedVolunteer === v._id && <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>}
                      </div>
                    </label>
                  ))
                )}
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="flex-1 py-4 text-gray-500 font-black hover:text-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAcceptOrder}
                  disabled={!selectedVolunteer}
                  className="flex-2 bg-emerald-500 text-white py-4 rounded-2xl font-black shadow-xl hover:bg-emerald-600 transition-all disabled:opacity-50"
                >
                  Confirm Assignment
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;
