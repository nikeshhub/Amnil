import { model } from "mongoose";
import userSchema from "../Schema/user.js";
import productSchema from "../Schema/product.js";
import storeSchema from "../Schema/store.js";

export const User = model("User", userSchema);
export const Product = model("Product", productSchema);
export const Store = model("Store", storeSchema);
