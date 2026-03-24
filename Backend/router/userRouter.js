import express from "express";
import {
    registerUser,
    loginUser,
    getUserDetails,
    getAllVolunteers,
    getAllNGOs,
    logoutUser,
    getGlobalStats,
    getUserImpact,
    getLeaderboard,
    updateMyProfile,
    updateMyPassword,
    getRecentActivity
} from "../controller/userController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

// Register User (Volunteer, NGO, or Donor)
router.post("/register", registerUser);

// Login User
router.post("/login", loginUser);

// Get User Details (Authenticated Users Only)
router.get("/me", isAuthenticated, getUserDetails);

// Get All Volunteers
router.get("/volunteers", getAllVolunteers);

// Get All NGOs
router.get("/ngos", getAllNGOs);

// Logout User
router.get("/logout", logoutUser);

// Stats & Leaderboard (Public/User)
router.get("/stats", getGlobalStats);
router.get("/leaderboard", getLeaderboard);
router.get("/activities", getRecentActivity);
router.get("/impact", isAuthenticated, getUserImpact);

// Profile Management
router.put("/profile/update", isAuthenticated, updateMyProfile);
router.put("/password/update", isAuthenticated, updateMyPassword);

export default router;
