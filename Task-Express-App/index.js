import express from "express";
import connectToMongoDb from "./connectToMongoDb.js";
import userRouter from "./src/db/Routes/users.js";
import productRouter from "./src/db/Routes/products.js";
import cartRouter from "./src/db/Routes/cart.js";
import isAuthenticated from "./src/Middlewares/isAuthenticated.js";
import orderRouter from "./src/db/Routes/order.js";
import dotenv from "dotenv";
import fsUserRouter from "./src/fs/Routes/user.js";
import fsproductRouter from "./src/fs/Routes/product.js";
import fsCartRouter from "./src/fs/Routes/cart.js";
import fsorderRouter from "./src/fs/Routes/order.js";

// console.log("Hi");

const app = express();
app.use(express.json());
const port = process.env.PORT;
dotenv.config();

if (process.env.STORE_TO === "DB") {
  app.use("/user", userRouter);
  app.use("/product", productRouter);
  app.use("/cart", isAuthenticated, cartRouter);
  app.use("/order", isAuthenticated, orderRouter);
} else if (process.env.STORE_TO === "FS") {
  app.use("/user", fsUserRouter);
  app.use("/product", fsproductRouter);
  app.use("/cart", fsCartRouter);
  app.use("/order", fsorderRouter);
} else {
  throw new Error("Invalid STORE_TO value");
}

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
connectToMongoDb();
