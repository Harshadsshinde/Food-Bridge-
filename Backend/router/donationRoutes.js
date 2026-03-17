import express from "express";
import {
  createDonationOrder,
  verifyDonation,
  
} from "../controller/donationController.js";

const router = express.Router();

router.post("/create-order", createDonationOrder);
router.post("/verify", verifyDonation);

export default router;