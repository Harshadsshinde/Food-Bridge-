import React, { useState } from "react";
import {
    FaHandHoldingHeart,
    FaUsers,
    FaUserTie,
    FaArrowRight,
    FaLeaf,
    FaChartLine,
    FaGlobeAsia,
    FaQuoteLeft,
    FaHeart,
    FaShieldAlt,
    FaBolt
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const HomePage = () => {

    const [hoveredRole, setHoveredRole] = useState(null);
    const navigate = useNavigate();

    const handleRoleSelect = (role) => {
        if (role === "ngo") navigate("/ngo/login");
        if (role === "user") navigate("/user/login");
        if (role === "volunteer") navigate("/volunteer/login");
    };

    const stats = [
        { icon: <FaLeaf className="text-emerald-500" />, value: "1.2M+", label: "Meals Shared" },
        { icon: <FaUsers className="text-blue-500" />, value: "25K+", label: "Active Heroes" },
        { icon: <FaGlobeAsia className="text-teal-500" />, value: "120+", label: "NGO Partners" },
        { icon: <FaChartLine className="text-amber-500" />, value: "₹50L+", label: "Funds Raised" },
    ];

    const roles = [
        {
            id: "user",
            title: "Join as Donor",
            description: "Turn your surplus food or small change into someone's meal and a brighter smile.",
            icon: <FaUsers className="text-4xl" />,
            color: "from-blue-500 to-cyan-600",
            shadow: "shadow-blue-200",
            iconBg: "bg-blue-100",
            iconColor: "text-blue-600",
            features: ["Donate Surplus Food", "Monetary Support", "Track Real Impact"]
        },
        {
            id: "ngo",
            title: "Join as NGO",
            description: "Empower your mission with a steady stream of donations and dedicated volunteers.",
            icon: <FaHandHoldingHeart className="text-4xl" />,
            color: "from-emerald-500 to-teal-600",
            shadow: "shadow-emerald-200",
            iconBg: "bg-emerald-100",
            iconColor: "text-emerald-600",
            features: ["Manage Inventory", "Coordinate Logistics", "Verify Deliveries"]
        },
        {
            id: "volunteer",
            title: "Join as Volunteer",
            description: "Be the bridge. Pick up and deliver food, earning points and making a direct impact.",
            icon: <FaUserTie className="text-4xl" />,
            color: "from-purple-500 to-pink-600",
            shadow: "shadow-purple-200",
            iconBg: "bg-purple-100",
            iconColor: "text-purple-600",
            features: ["Flexible Hours", "Earn Badges", "Community Leaderboard"]
        },
    ];

    return (
        <div className="min-h-screen bg-white font-sans selection:bg-emerald-100 selection:text-emerald-900">

            {/* Floating Navigation (Simple) */}
            <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
                <div className="container mx-auto px-6 h-20 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
                            <FaHeart className="text-white text-xl" />
                        </div>
                        <span className="text-2xl font-black tracking-tighter text-gray-900">FOOD<span className="text-emerald-600">BRIDGE</span></span>
                    </div>
                    <div className="hidden md:flex items-center gap-8">
                        <button onClick={() => navigate("/user/login")} className="text-gray-600 font-bold hover:text-emerald-600 transition-colors">Sign In</button>
                        <button onClick={() => navigate("/user/login")} className="px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all active:scale-95">Get Started</button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="flex-1 text-center lg:text-left">
                            <motion.div 
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full font-bold text-sm mb-6"
                            >
                                <FaBolt className="text-emerald-500" />
                                <span>Zero Hunger, Zero Waste</span>
                            </motion.div>
                            
                            <motion.h1 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-6xl md:text-8xl font-black text-gray-900 leading-[0.9] mb-8"
                            >
                                Sharing is the New <span className="text-emerald-600 italic">Caring.</span>
                            </motion.h1>
                            
                            <motion.p 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-xl text-gray-500 mb-10 max-w-xl"
                            >
                                We've built the world's most efficient platform for distributing surplus food. Connect with local NGOs, volunteers, and donors in seconds.
                            </motion.p>
                            
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                            >
                                <button onClick={() => navigate("/user/login")} className="px-10 py-5 bg-emerald-600 text-white font-black text-lg rounded-2xl shadow-xl shadow-emerald-200 hover:bg-emerald-700 transition-all active:scale-95">Start Donating Now</button>
                                <button className="px-10 py-5 bg-gray-900 text-white font-black text-lg rounded-2xl shadow-xl shadow-gray-200 hover:bg-gray-800 transition-all active:scale-95">Watch Impact</button>
                            </motion.div>
                        </div>
                        
                        <div className="flex-1 relative">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 1 }}
                                className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl"
                            >
                                <img 
                                    src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80" 
                                    alt="Hero"
                                    className="w-full h-full object-cover"
                                />
                            </motion.div>
                            {/* Decorative Blobs */}
                            <div className="absolute -top-10 -right-10 w-64 h-64 bg-emerald-100 rounded-full blur-3xl opacity-60"></div>
                            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-60"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="text-center"
                            >
                                <div className="text-5xl md:text-6xl font-black text-emerald-600 mb-2">
                                    {stat.value}
                                </div>
                                <div className="text-gray-500 font-bold uppercase tracking-widest text-sm">
                                    {stat.label}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Role Selection */}
            <section className="py-32">
                <div className="container mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <h2 className="text-5xl font-black text-gray-900 mb-6">How would you like to <span className="text-emerald-600">contribute?</span></h2>
                        <p className="text-xl text-gray-500 font-medium">Whether you have food, money, or time, there's a seat at our table for you.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
                        {roles.map((role, index) => (
                            <motion.div
                                key={role.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2 }}
                                whileHover={{ y: -15 }}
                                onHoverStart={() => setHoveredRole(role.id)}
                                onHoverEnd={() => setHoveredRole(null)}
                                onClick={() => handleRoleSelect(role.id)}
                                className="relative group cursor-pointer"
                            >
                                <div className="bg-white border-2 border-gray-100 rounded-[3rem] p-10 shadow-xl hover:shadow-2xl hover:border-emerald-100 transition-all duration-500 h-full flex flex-col">
                                    <div className={`w-20 h-20 ${role.iconBg} ${role.iconColor} rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500`}>
                                        {role.icon}
                                    </div>

                                    <h3 className="text-3xl font-black text-gray-900 mb-4">
                                        {role.title}
                                    </h3>

                                    <p className="text-gray-500 text-lg mb-8 flex-grow font-medium leading-relaxed">
                                        {role.description}
                                    </p>

                                    <div className="space-y-4 mb-10">
                                        {role.features.map((feature, fIdx) => (
                                            <div key={fIdx} className="flex items-center gap-3 text-gray-600 font-bold">
                                                <div className="w-6 h-6 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 text-xs">
                                                    <FaShieldAlt />
                                                </div>
                                                <span>{feature}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => handleRoleSelect(role.id)}
                                        className={`w-full py-5 bg-gradient-to-r ${role.color} text-white font-black text-lg rounded-2xl shadow-xl ${role.shadow} hover:scale-[1.02] transition-all active:scale-95 flex items-center justify-center gap-3`}
                                    >
                                        <span>Continue as {role.id.toUpperCase()}</span>
                                        <FaArrowRight className="text-sm" />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonial Section */}
            <section className="py-32 bg-gray-900 text-white overflow-hidden relative">
                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <FaQuoteLeft className="text-emerald-500 text-6xl mb-10 mx-auto opacity-50" />
                        <h2 className="text-4xl md:text-5xl font-black mb-12 italic leading-tight">
                            "FoodBridge has completely transformed how our NGO operates. We've reduced food waste in our city by nearly 40% in just six months."
                        </h2>
                        <div className="flex items-center justify-center gap-4">
                            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-emerald-500">
                                <img src="https://i.pravatar.cc/150?u=1" alt="Avatar" />
                            </div>
                            <div className="text-left">
                                <p className="font-black text-xl">Rajesh Kumar</p>
                                <p className="text-emerald-400 font-bold tracking-widest uppercase text-sm">Director, Hope Foundation</p>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Decorative blob */}
                <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl"></div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-gray-100">
                <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8 text-gray-400 font-bold">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                            <FaHeart className="text-gray-400 text-sm" />
                        </div>
                        <span className="text-xl font-black tracking-tighter text-gray-900 uppercase">FoodBridge</span>
                    </div>
                    <p>© 2026 FoodBridge Global. All rights reserved.</p>
                    <div className="flex gap-8">
                        <button className="hover:text-emerald-600 transition-colors">Privacy</button>
                        <button className="hover:text-emerald-600 transition-colors">Terms</button>
                        <button className="hover:text-emerald-600 transition-colors">Contact</button>
                    </div>
                </div>
            </footer>

        </div>
    );
};

export default HomePage;