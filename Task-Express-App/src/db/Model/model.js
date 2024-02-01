import { model } from "mongoose";
import userSchema from "../Schema/users.js";
import productSchema from "../Schema/products.js";
import cartSchema from "../Schema/cart.js";
import orderSchema from "../Schema/order.js";

export const User = model("User", userSchema);
export const Product = model("Product", productSchema);
export const Cart = model("Cart", cartSchema);
export const Order = model("Order", orderSchema);
