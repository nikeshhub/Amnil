import express from "express";
import connectToMongoDb from "./connectToMongoDB.js";
import dotenv from "dotenv";
import userRouter from "./src/Routes/user.js";
import storeRouter from "./src/Routes/store.js";
import productRouter from "./src/Routes/product.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

dotenv.config();

const port = process.env.PORT;

//middlewares
app.use("/user", userRouter);
app.use("/store", storeRouter);
app.use("/product", productRouter);
app.use(express.static("./public"));

app.listen(port, () => {
  console.log(`server is listening on ${port}`);
});
connectToMongoDb();
