import razorpay from "../rz-config/razorpay.js";
import crypto from "crypto";
import Donation from "../models/donationSchema.js";



// CREATE ORDER + PENDING DONATION

export const createDonationOrder = async (req, res) => {
    try {
        const { amount, donorName, donorEmail } = req.body;

        // Validation
        if (!amount || amount < 1) {
            return res.status(400).json({
                success: false,
                message: "Invalid donation amount"
            });
        }

        const options = {
            amount: amount * 100,
            currency: "INR",
            receipt: "donation_" + Date.now()
        };

        const order = await razorpay.orders.create(options);

        // Create pending donation
        const donation = await Donation.create({
            donorName: donorName || "Anonymous",
            donorEmail: donorEmail || "N/A",
            amount,
            orderId: order.id,
            status: "pending"
        });

        res.json({
            success: true,
            order,
            donationId: donation._id
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};



// VERIFY PAYMENT (MAIN FLOW)

export const verifyDonation = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest("hex");

        if (expectedSignature === razorpay_signature) {

            const donation = await Donation.findOneAndUpdate(
                { orderId: razorpay_order_id, status: "pending" }, // prevent duplicate updates
                {
                    paymentId: razorpay_payment_id,
                    status: "success"
                },
                { new: true }
            );

            return res.json({
                success: true,
                donation
            });

        } else {
            return res.status(400).json({
                success: false,
                message: "Payment verification failed"
            });
        }

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};