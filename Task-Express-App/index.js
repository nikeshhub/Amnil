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
import pool from "./db.js";
import pgUserRouter from "./src/postgres/Routes/user.js";
import pgProductRouter from "./src/postgres/Routes/products.js";
import { getFeaturedProducts } from "./src/postgres/Controllers/pages.js";
import pgCartRouter from "./src/postgres/Routes/cart.js";
import pgOrderRouter from "./src/postgres/Routes/order.js";
import pgAdminRouter from "./src/postgres/Routes/admin.js";
import logger from "./src/utils/logger.js";
import { swaggerServe, swaggerSetup } from "./swagger.js";

// console.log("Hi");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(methodOverride("_method"));
const port = process.env.PORT;
dotenv.config();

// Serve Swagger UI
app.use("/api-docs", swaggerServe, swaggerSetup);

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
} else if (process.env.STORE_TO === "PG") {
  app.get("/", getFeaturedProducts);
  app.use("/user", pgUserRouter);
  app.use("/product", pgProductRouter);
  app.use("/cart", pgCartRouter);
  app.use("/order", pgOrderRouter);
  app.use("/admin", pgAdminRouter);
} else {
  throw new Error("Invalid STORE_TO value");
}

app.use(express.static("./public"));

app.listen(port, () => {
  logger.log("info", `Server is running on ${port}`);
  // console.log(`Server is running on ${port}`);
});
runCronJob();

pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    logger.log("error", "Error connecting to PostgreSQL:", err.stack);
    // console.error("Error connecting to PostgreSQL:", err.stack);
  } else {
    logger.log("info", "Connected to PostgreSQL ", res.rows[0].now);
    // console.log("Connected to PostgreSQL at:", res.rows[0].now);
  }
});
connectToMongoDb();
