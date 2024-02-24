import express from "express";
import connectToMongoDb from "./connectToMongoDb.js";
import methodOverride from "method-override";
import userRouter from "./src/db/Routes/users.js";
import productRouter from "./src/db/Routes/products.js";
import cartRouter from "./src/db/Routes/cart.js";
import cron from "node-cron";

import isAuthenticated from "./src/Middlewares/isAuthenticated.js";
import orderRouter from "./src/db/Routes/order.js";
import dotenv from "dotenv";
import fsUserRouter from "./src/fs/Routes/user.js";
import fsproductRouter from "./src/fs/Routes/product.js";
import fsCartRouter from "./src/fs/Routes/cart.js";
import fsorderRouter from "./src/fs/Routes/order.js";
import navbarMiddleware from "./src/Middlewares/navbarMiddleware.js";
import homeRouter from "./src/db/Routes/home.js";
import cookieParser from "cookie-parser";
import sidebarMiddleware from "./src/Middlewares/sidebarMiddleware.js";
import adminRouter from "./src/db/Routes/admin.js";
import { runCronJob } from "./src/utils/auctionWinnerEmail.js";

// console.log("Hi");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(methodOverride("_method"));
const port = process.env.PORT;
dotenv.config();

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(navbarMiddleware);
app.use(sidebarMiddleware);

if (process.env.STORE_TO === "DB") {
  app.use("/", homeRouter);

  app.use("/user", userRouter);
  app.use("/product", productRouter);
  app.use("/cart", cartRouter);
  app.use("/order", orderRouter);
  app.use("/admin", adminRouter);
} else if (process.env.STORE_TO === "FS") {
  app.use("/user", fsUserRouter);
  app.use("/product", fsproductRouter);
  app.use("/cart", fsCartRouter);
  app.use("/order", fsorderRouter);
} else {
  throw new Error("Invalid STORE_TO value");
}

app.use(express.static("./public"));

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
runCronJob()
connectToMongoDb();
