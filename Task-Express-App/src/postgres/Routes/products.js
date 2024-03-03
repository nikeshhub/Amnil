import { Router } from "express";
import {
  bidProducts,
  createProduct,
  searchProducts,
} from "../Controllers/products.js";
import upload from "../../Middlewares/upload.js";
import {
  getAuctionPage,
  getProducts,
  getSpecificAuction,
  getSpecificProduct,
} from "../Controllers/pages.js";
import isAuthenticated from "../../Middlewares/isAuthenticated.js";
import { addToCart } from "../Controllers/cart.js";

const pgProductRouter = Router();

pgProductRouter
  .route("/")
  .post(upload.single("files"), createProduct)
  .get(getProducts);

pgProductRouter.route("/cart").post(isAuthenticated, addToCart);

pgProductRouter.route("/search").get(searchProducts);
pgProductRouter.route("/auction").get(getAuctionPage);
pgProductRouter.route("/auction/bid/:id").post(isAuthenticated, bidProducts);
pgProductRouter.route("/auction/:id").get(getSpecificAuction);

pgProductRouter.route("/:id").get(getSpecificProduct);

export default pgProductRouter;
