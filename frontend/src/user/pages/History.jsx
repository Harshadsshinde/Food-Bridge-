import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { 
  FaCalendarAlt, 
  FaCheckCircle, 
  FaClock, 
  FaMapMarkerAlt, 
  FaUtensils, 
  FaUser,
  FaFilter,
  FaSearch,
  FaSort,
  FaHandHoldingUsd,
  FaArrowLeft,
  FaFileDownload,
  FaChevronRight
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const History = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [donations, setDonations] = useState([]);
  const [view, setView] = useState("food"); // "food" or "money"
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortOption, setSortOption] = useState("newest");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [orderRes, donationRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/order/orders`, { withCredentials: true }),
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/donation/user-donations`, { withCredentials: true })
        ]);
        setHistory(orderRes.data.orders || []);
        setDonations(donationRes.data.donations || []);
      } catch (err) {
        console.error("History fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user?._id, user?.id]);

  const filteredHistory = history.filter(order => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = order.foodDetails.toLowerCase().includes(term) || order.address.toLowerCase().includes(term);
    const matchesStatus = statusFilter === "All" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    return sortOption === "newest" ? new Date(b.createdAt) - new Date(a.createdAt) : new Date(a.createdAt) - new Date(b.createdAt);
  });

  const filteredDonations = donations.filter(donation => {
    const term = searchTerm.toLowerCase();
    return donation.donorName.toLowerCase().includes(term);
  }).sort((a, b) => {
    return sortOption === "newest" ? new Date(b.createdAt) - new Date(a.createdAt) : new Date(a.createdAt) - new Date(b.createdAt);
  });

  const getStatusColor = (status) => {
    const colors = {
      Completed: "bg-emerald-500",
      Pending: "bg-amber-500",
      Accepted: "bg-blue-500",
      Delivered: "bg-purple-500",
      Cancelled: "bg-red-500"
    };
    return colors[status] || "bg-gray-500";
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Hero Header */}
      <div className="bg-emerald-900 text-white pt-20 pb-32 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate("/user/dashboard")}
                className="p-3 bg-white/10 rounded-2xl hover:bg-white/20 transition-all"
              >
                <FaArrowLeft className="text-2xl" />
              </button>
              <div>
                <h1 className="text-4xl font-black tracking-tighter">Your Impact Journey</h1>
                <p className="text-emerald-400 font-bold">Track every meal shared and every life touched.</p>
              </div>
            </div>

            <div className="flex bg-white/10 p-1.5 rounded-2xl backdrop-blur-md">
              <button
                onClick={() => setView("food")}
                className={`px-8 py-3 rounded-xl font-black transition-all flex items-center gap-2 ${
                  view === "food" ? "bg-white text-emerald-900 shadow-xl" : "text-emerald-100 hover:bg-white/5"
                }`}
              >
                <FaUtensils /> Food
              </button>
              <button
                onClick={() => setView("money")}
                className={`px-8 py-3 rounded-xl font-black transition-all flex items-center gap-2 ${
                  view === "money" ? "bg-white text-emerald-900 shadow-xl" : "text-emerald-100 hover:bg-white/5"
                }`}
              >
                <FaHandHoldingUsd /> Money
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-6xl px-6 -mt-16">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          {[
            { label: "Total Contributions", value: view === "food" ? history.length : donations.length, color: "bg-blue-500" },
            { label: "Success Rate", value: "98%", color: "bg-emerald-500" },
            { label: "Lives Impacted", value: view === "food" ? history.length * 5 : Math.floor(donations.reduce((a,b)=>a+b.amount,0)/50), color: "bg-purple-500" },
            { label: "Impact Points", value: view === "food" ? history.length * 10 : Math.floor(donations.reduce((a,b)=>a+b.amount,0)/10), color: "bg-amber-500" },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-[2rem] p-6 shadow-xl border border-gray-100">
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-3xl font-black text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-[2.5rem] shadow-xl p-8 mb-10 flex flex-col md:flex-row gap-6 border border-gray-100">
          <div className="relative flex-1">
            <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
            <input
              type="text"
              placeholder={`Search your ${view === "food" ? "donations" : "contributions"}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-gray-50 border-2 border-transparent focus:border-emerald-500 rounded-2xl font-bold outline-none transition-all"
            />
          </div>
          <div className="flex gap-4">
            {view === "food" && (
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-emerald-500 rounded-2xl font-bold outline-none transition-all appearance-none cursor-pointer"
              >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
                <option value="Accepted">Accepted</option>
              </select>
            )}
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-emerald-500 rounded-2xl font-bold outline-none transition-all appearance-none cursor-pointer"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>
        </div>

        {/* List */}
        <div className="space-y-6">
          {loading ? (
            [1,2,3].map(i => <div key={i} className="h-40 bg-white animate-pulse rounded-[2.5rem] shadow-sm"></div>)
          ) : (view === "food" ? filteredHistory : filteredDonations).length === 0 ? (
            <div className="bg-white rounded-[3rem] p-20 text-center shadow-sm border border-gray-100">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300 text-5xl">
                <FaClock />
              </div>
              <h3 className="text-3xl font-black text-gray-900 mb-2">No Records Found</h3>
              <p className="text-xl text-gray-500 font-medium">Your activity will appear here once you start sharing.</p>
            </div>
          ) : (
            (view === "food" ? filteredHistory : filteredDonations).map((item, idx) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all group"
              >
                <div className="p-8 flex flex-col md:flex-row items-center gap-8">
                  <div className={`w-20 h-20 rounded-3xl flex items-center justify-center text-white text-3xl shrink-0 ${view === 'food' ? getStatusColor(item.status) : 'bg-emerald-500'} shadow-lg group-hover:scale-110 transition-transform`}>
                    {view === 'food' ? <FaUtensils /> : <FaHandHoldingUsd />}
                  </div>

                  <div className="flex-1 text-center md:text-left">
                    <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 mb-2">
                      <h3 className="text-2xl font-black text-gray-900">
                        {view === 'food' ? (item.foodDetails || "Food Donation") : `Financial Donation: ₹${item.amount}`}
                      </h3>
                      {view === 'food' && (
                        <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap justify-center md:justify-start items-center gap-6 text-gray-500 font-bold">
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-emerald-500" />
                        <span>{new Date(item.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaMapMarkerAlt className="text-red-500" />
                        <span className="truncate max-w-[200px]">{item.address || "Digital Contribution"}</span>
                      </div>
                      {view === 'money' && (
                        <div className="flex items-center gap-2">
                          <FaCheckCircle className="text-emerald-500" />
                          <span className="text-xs font-mono">{item.paymentId?.substring(0, 12)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    {(view === 'money' || item.status === 'Completed') && (
                      <button className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl hover:bg-emerald-100 transition-all flex items-center gap-2 font-black">
                        <FaFileDownload /> <span className="hidden sm:inline">Receipt</span>
                      </button>
                    )}
                    <button className="p-4 bg-gray-50 text-gray-400 rounded-2xl hover:bg-gray-100 transition-all">
                      <FaChevronRight />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default History;
