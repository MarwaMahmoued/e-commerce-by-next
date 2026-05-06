import mongoose from "mongoose";

const CouponSchema = new mongoose.Schema({
    code:
     { type: String, required: true, unique: true }, 
    discount:
     { type: Number, required: true }, 
    expiryDate: 
    { type: Date, required: true },
    isActive:
    { type: Boolean, default: true }
}, { timestamps: true });

const Coupon = mongoose.models.Coupon || mongoose.model("Coupon", CouponSchema);
export default Coupon;