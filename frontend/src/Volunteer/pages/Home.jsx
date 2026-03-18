import React, { useEffect, useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import {
  FiClock,
  FiUser,
  FiMapPin,
  FiLogOut,
  FiCheckCircle,
  FiTruck,
  FiNavigation,
  
  FiActivity,
  FiStar,
} from "react-icons/fi";
import { FaHandHoldingHeart, FaCrown, FaMedal } from "react-icons/fa";
import toast from "react-hot-toast";
import axios from "axios";
import { FiAward } from "react-icons/fi";


const Home = () => {
  const { user, logout } = useContext(AuthContext);
  const [acceptedOrders, setAcceptedOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [userImpact, setUserImpact] = useState(null);
  const [leaderboard, setLeaderboard] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [ordersRes, impactRes, leaderboardRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/order/volunteer/orders`, { withCredentials: true }),
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/impact`, { withCredentials: true }),
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/leaderboard`),
      ]);
      setAcceptedOrders(ordersRes.data.orders);
      setUserImpact(impactRes.data.impact);
      setLeaderboard(leaderboardRes.data.leaderboard);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteOrder = async (orderId) => {
    setCompleting(true);
    try {
      const { data } = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/order/complete`,
        { orderId },
        { withCredentials: true }
      );

      if (data.success) {
        toast.success("Mission Accomplished! Order marked as completed.");
        setSelectedOrder(null);
        fetchAllData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to complete order");
    } finally {
      setCompleting(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Stats calculations
  const completedTodayCount = 0; // This could be fetched from backend history if needed

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-72 bg-emerald-900 text-white flex flex-col">
        <div className="p-8">
          <h1 className="text-2xl font-black tracking-tighter flex items-center gap-2">
            <FiTruck className="text-emerald-400" /> VOLUNTEER
          </h1>
          <p className="text-emerald-400 text-xs font-bold mt-1 uppercase tracking-widest">Delivery Squad</p>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-emerald-800 rounded-xl text-white font-bold transition-all">
            <FiNavigation /> Active Missions
          </button>
          <button onClick={() => navigate("/volunteer/history")} className="w-full flex items-center gap-3 px-4 py-3 text-emerald-300 hover:bg-emerald-800 hover:text-white rounded-xl font-bold transition-all">
            <FiClock /> Past Deliveries
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
              <p className="text-xs text-emerald-400 truncate">On-Ground Hero</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 py-3 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-xl font-bold transition-all">
            <FiLogOut /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-10 overflow-y-auto">
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6">
          <div>
            <h2 className="text-3xl font-black text-gray-900">Your Active Missions</h2>
            <p className="text-gray-500">Pick up and deliver food to those in need.</p>
          </div>
          <div className="flex gap-4 w-full lg:w-auto">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 flex-1 lg:flex-none">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500 text-xl">
                <FiTruck />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase">Active</p>
                <p className="text-xl font-black text-gray-900">{acceptedOrders.length}</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 flex-1 lg:flex-none">
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500 text-xl">
                <FiCheckCircle />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase">Completed</p>
                <p className="text-xl font-black text-gray-900">{userImpact?.mealsProvided || 0}</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 flex-1 lg:flex-none">
              <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500 text-xl">
                <FiStar />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase">Impact Points</p>
                <p className="text-xl font-black text-gray-900">{(userImpact?.mealsProvided || 0) * 10}</p>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
          {/* Active Missions List */}
          <div className="xl:col-span-2 space-y-8">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="h-64 bg-white animate-pulse rounded-[2.5rem] shadow-sm"></div>
                ))}
              </div>
            ) : acceptedOrders.length === 0 ? (
              <div className="bg-white rounded-[3rem] p-16 text-center shadow-sm border border-gray-100">
                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-500 text-4xl">
                  <FiCheckCircle />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-2">No Active Missions</h3>
                <p className="text-gray-500 max-w-sm mx-auto">Great job! You've completed all your deliveries. Wait for new assignments from NGOs.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {acceptedOrders.map((order) => (
                  <motion.div
                    key={order._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-gray-100 flex flex-col hover:shadow-2xl transition-all duration-300"
                  >
                    <div className="p-8 border-b border-gray-50 bg-emerald-50/30">
                      <div className="flex justify-between items-start mb-4">
                        <span className="bg-emerald-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                          In Progress
                        </span>
                        <span className="text-xs text-gray-400 font-bold uppercase">
                          ID: {order._id.slice(-6)}
                        </span>
                      </div>
                      <h3 className="text-2xl font-black text-gray-900 mb-1">{order.foodDetails}</h3>
                      <p className="text-emerald-600 font-bold">{order.quantity} Units • {order.foodType}</p>
                    </div>

                    <div className="p-8 space-y-6 flex-1">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-emerald-500 shrink-0">
                          <FiMapPin />
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 font-black uppercase tracking-widest">Pickup Address</p>
                          <p className="font-bold text-gray-800 leading-tight">{order.address}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-blue-500 shrink-0">
                          <FiUser />
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 font-black uppercase tracking-widest">Contact Donor</p>
                          <p className="font-bold text-gray-800">{order.userId?.firstName || "Anonymous"}</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-8 pt-0">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="w-full bg-emerald-500 text-white py-4 rounded-2xl font-black shadow-xl hover:bg-emerald-600 transition-all active:scale-95 flex items-center justify-center gap-2"
                      >
                        Mark as Delivered <FiCheckCircle />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar - Leaderboard & Activity */}
          <div className="space-y-8">
            {/* Top Volunteers */}
            <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-gray-100">
              <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                <FiAward  className="text-yellow-500" /> Squad Leaders
              </h3>
              <div className="space-y-4">
                {leaderboard?.topVolunteers?.slice(0, 5).map((vol, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 hover:bg-emerald-50 transition-all">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                        idx === 0 ? "bg-yellow-400 text-white" : "bg-white text-gray-400"
                      }`}>
                        {idx + 1}
                      </div>
                      <p className="font-bold text-gray-800 text-sm">{vol.name}</p>
                    </div>
                    <p className="font-black text-emerald-600 text-sm">{vol.completedTasks} Missions</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Impact Tips */}
            <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden">
              <div className="relative z-10">
                <FiStar className="text-3xl text-emerald-300 mb-4" />
                <h4 className="text-xl font-bold mb-2">Pro Tip!</h4>
                <p className="text-emerald-100 text-sm leading-relaxed">
                  Always verify the food quality before pickup. Your diligence ensures safe meals for our beneficiaries.
                </p>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
            </div>
          </div>
        </div>
      </main>

      {/* Completion Confirmation Modal */}
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
              className="relative bg-white w-full max-w-md rounded-[3rem] shadow-2xl overflow-hidden p-10 text-center"
            >
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-500 text-4xl">
                <FiCheckCircle />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">Confirm Delivery</h3>
              <p className="text-gray-500 mb-8">Have you successfully picked up and delivered "{selectedOrder.foodDetails}" to the beneficiary?</p>

              <div className="flex gap-4">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="flex-1 py-4 text-gray-500 font-black hover:text-gray-700"
                >
                  Go Back
                </button>
                <button
                  onClick={() => handleCompleteOrder(selectedOrder._id)}
                  disabled={completing}
                  className="flex-2 bg-emerald-500 text-white py-4 px-8 rounded-2xl font-black shadow-xl hover:bg-emerald-600 transition-all disabled:opacity-50"
                >
                  {completing ? "Updating..." : "Yes, Delivered!"}
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
