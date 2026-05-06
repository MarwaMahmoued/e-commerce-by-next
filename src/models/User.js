import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name:
    { type: String, required: true },
    email:
     { type: String, required: true, unique: true },
    password: 
    { type: String }, 
    phone:
     { type: String, required: false},
    image:
     { type: String }, 
    role: {
      type: String,
      enum: ["customer", "seller", "admin"],
      default: "customer",
    },

    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },

    paymentDetails: {
      cardHolderName: String,
      cardNumber: String, 
      expiryDate: String,
    },

    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    cart: [
      {
        productId: { 
          type: mongoose.Schema.Types.ObjectId, 
          ref: "Product" 
        },
        quantity: { 
          type: Number, 
          default: 1,
          min: [1, "Quantity must be at least 1"] 
        },
      },
    ],
verificationToken: { type: String },
    isVerified:
     { type: Boolean, default: false },

   
    loyaltyPoints: 
    { type: Number, default: 0 },
  },
  { timestamps: true }, 
);


const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
