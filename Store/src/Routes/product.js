import { Router } from "express";
import isAuthenticated from "../Middlewares/isAuthenticated.js";
import upload from "../Middlewares/upload.js";
import { createProduct, getProductsByStore } from "../Controllers/product.js";

const productRouter = Router();

productRouter
  .route("/")
  .post(isAuthenticated, upload.single("productImage"), createProduct);

productRouter.route("/store/:id").get(getProductsByStore);

export default productRouter;
