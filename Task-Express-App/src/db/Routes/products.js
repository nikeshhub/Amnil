import { Router } from "express";
import {
  bidProducts,
  changeQuantity,
  createProduct,
  deleteAllProducts,
  deleteProduct,
  getAuctionPage,
  getOutOfStock,
  getProducts,
  getSpecificAuction,
  getSpecificProduct,
  makeLimitedProducts,
  searchProducts,
  updateProducts,
} from "../Controller/products.js";
import upload from "../../Middlewares/upload.js";
import isAuthenticated from "../../Middlewares/isAuthenticated.js";
import isAuthorized from "../../Middlewares/isAuthorized.js";
import { addToCart } from "../Controller/cart.js";

let productRouter = Router();

productRouter.route("/").get(getProducts);
productRouter.route("/auction").get(getAuctionPage);
productRouter.route("/auction/:id").get(getSpecificAuction);

productRouter.route("/search").get(isAuthenticated, searchProducts);
productRouter
  .route("/cart")
  .post(isAuthenticated, isAuthorized(["customer"]), addToCart);

productRouter
  .route("/out-of-stock")
  .get(isAuthenticated, isAuthorized(["admin"]), getOutOfStock);

productRouter
  .route("/all")
  .delete(isAuthenticated, isAuthorized(["admin"]), deleteAllProducts);

productRouter
  .route("/quantity/:id")
  .patch(isAuthenticated, isAuthorized(["admin"]), changeQuantity);

productRouter.route("/limited/:id").put(makeLimitedProducts);
productRouter.route("/auction/bid/:id").post(isAuthenticated, bidProducts);

productRouter
  .route("/:id")
  .get(getSpecificProduct)
  .put(isAuthenticated, isAuthorized(["admin"]), updateProducts)
  .delete(isAuthenticated, isAuthorized(["admin"]), deleteProduct);

export default productRouter;
