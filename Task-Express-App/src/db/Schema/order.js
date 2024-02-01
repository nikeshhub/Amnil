// orderModel.js
import { Schema } from "mongoose";

const orderItemSchema = new Schema({
  productId: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const orderSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  items: {
    type: [orderItemSchema],
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
});

export default orderSchema;
