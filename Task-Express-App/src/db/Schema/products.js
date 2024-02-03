import { Schema } from "mongoose";

const productSchema = Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
    },
    price: {
      type: Number,
      required: [true, "price is required"],
    },
    description: {
      type: String,
      required: [true, "description is required"],
    },
    quantity: {
      type: Number,
      required: [true, "quantity is required"],
    },
    product_type: {
      type: String,
      required: [true, "product_type is required"],
    },
    photos: [{ type: String }],
  },
  { timestamps: true }
);

export default productSchema;
