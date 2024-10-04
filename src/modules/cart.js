import mongoose, { Schema } from "mongoose";

const cartStatus = ["Active", "Completed"];

const cartItem = new Schema({
  product: { type: Schema.Types.ObjectId, ref: "products", required: true },
  quantity: { type: Number, default: 1, required: true },
  price: { type: Number, required: true },
});

const cartSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "users", required: true },
  items: [cartItem],
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: cartStatus, default: "Active" },
});

export const Cart = mongoose.model("Cart", cartSchema);
