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
    isLimited: {
      type: Boolean,
      default: false,
    },
    highestBid: {
      bidder: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      bidAmount: Number,
      notified: {
        type: Boolean,
        default: false,
      },
    },
    expiryDate: {
      type: Date,
      required: [
        function () {
          return this.isLimited === true;
        },
        "expiryDate is required for limited products",
      ],
    },
    photos: [{ type: String }],
  },
  { timestamps: true }
);

export default productSchema;
