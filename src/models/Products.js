import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
}, { timestamps: true });

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    images: [{ type: String, required: true }], 
    category: { 
        type: String, 
        required: true, 
        enum: ["Electronics", "Fashion", "Home", "Beauty", "Others"] 
    },
    stock: { type: Number,required: [true, "Please enter product stock"], default: 0 },
    seller: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    
 
    reviews: [reviewSchema], 
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 }, 
    
    isFeatured: { type: Boolean, default: false } 
  },
  { timestamps: true }
);

const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);
export default Product;