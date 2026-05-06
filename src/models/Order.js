import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
    user:
     { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    orderItems: [
        {
            name: 
            { type: String, required: true },
            quantity:
             { type: Number, required: true },
            image: 
            { type: String, required: true },
            price:
             { type: Number, required: true },
            product: 
            { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
            seller:
             { type: mongoose.Schema.Types.ObjectId, ref: "User" } 
        }
    ],
    shippingAddress: {
        address: String,
        city: String,
        phone: String
    },
    paymentMethod: 
    { type: String, required: true }, 
    paymentResult:
     { id: String, status: String },
    itemsPrice: 
    { type: Number, default: 0.0 },
    taxPrice:
     { type: Number, default: 0.0 },
    shippingPrice: 
    { type: Number, default: 0.0 },
    totalPrice:
     { type: Number, default: 0.0 },
    isPaid:
     { type: Boolean, default: false },
    paidAt: Date,
    orderStatus: { 
        type: String, 
        required: true, 
        enum: ["Processing", "Shipped", "Delivered", "Cancelled"], 
        default: "Processing" 
    }
}, { timestamps: true });

const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);
export default Order;