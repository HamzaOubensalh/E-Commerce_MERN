import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema({
  userID: { type: Number, required: true },
  productPurchased: { type: String, required: true },
  totalAmount: { type: Number, required: true },
});

export const orderModel = mongoose.model("orders", orderSchema);
