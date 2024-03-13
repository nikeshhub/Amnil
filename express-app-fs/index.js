import express, { json } from "express";
// import fs from "fs/promises";
import {
  changeQuantity,
  createProduct,
  deleteAllProducts,
  deleteProduct,
  getOutOfStock,
  getProducts,
  getSpecificProduct,
  searchProducts,
  updateProducts,
} from "./products.js";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getSpecificUser,
  loginUser,
  updateUser,
} from "./users.js";
import isAuthenticated from "./isAuthenticated.js";
import isAuthorized from "./isAuthorized.js";
import { addToCart, getCart, getOrders, makeOrder } from "./orders.js";

const app = express();
const port = 8000;

app.use(json());

//product routes
app.post("/product", createProduct);
app.get("/product", getProducts);
app.get("/product/out-of-stock", getOutOfStock);
app.put("/product/update/:id", updateProducts);
app.patch("/product/quantity/:id", changeQuantity);
app.get("/product/search", searchProducts);
app.delete("/product/delete/all", deleteAllProducts);
app.delete("/product/delete/:id", deleteProduct);
app.get("/product/:id", getSpecificProduct);

//user routes
app.post("/user", createUser);
app.post("/login", loginUser);
app.get(
  "/user",
  isAuthenticated,
  // isAuthorized(["admin", "superAdmin"]),
  getAllUsers
);
app.get(
  "/user/:id",
  isAuthenticated,
  isAuthorized(["admin", "superAdmin"]),
  getSpecificUser
);
app.put(
  "/user/:id",
  isAuthenticated,
  isAuthorized(["admin", "superAdmin"]),
  updateUser
);
app.delete(
  "/user/:id",
  isAuthenticated,
  isAuthorized(["admin", "superAdmin"]),
  deleteUser
);

//order routes
app.post("/add-to-cart", isAuthenticated, addToCart);
app.get("/cart", isAuthenticated, getCart);
app.post("/order", isAuthenticated, makeOrder);
app.get(
  "/order",
  isAuthenticated,
  isAuthorized(["admin", "superAdmin"]),
  getOrders
);

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
