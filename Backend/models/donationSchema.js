import mongoose from "mongoose";

const donationSchema = new mongoose.Schema({
    donorName: {
        type: String,
        required: true
    },
    donorEmail: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    paymentId: String,
    orderId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "success", "failed"],
        default: "pending"
    }
}, { timestamps: true });

const Donation = mongoose.model("Donation", donationSchema);

export default Donation;