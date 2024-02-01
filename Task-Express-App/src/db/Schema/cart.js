// cartModel.js
import { Schema } from "mongoose";

const cartItemSchema = new Schema({
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

const cartSchema = new Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  items: [cartItemSchema],
});

export default cartSchema;
