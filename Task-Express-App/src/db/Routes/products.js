import { Router } from "express";
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
} from "../Controller/products.js";
import upload from "../../Middlewares/upload.js";
import isAuthenticated from "../../Middlewares/isAuthenticated.js";
import isAuthorized from "../../Middlewares/isAuthorized.js";

let productRouter = Router();

productRouter
  .route("/")
  .post(
    isAuthenticated,
    isAuthorized(["admin"]),
    upload.array("files", 5),
    createProduct
  )
  .get(isAuthenticated, getProducts);

productRouter.route("/search").get(isAuthenticated, searchProducts);

productRouter
  .route("/out-of-stock")
  .get(isAuthenticated, isAuthorized(["admin"]), getOutOfStock);

productRouter
  .route("/all")
  .delete(isAuthenticated, isAuthorized(["admin"]), deleteAllProducts);

productRouter
  .route("/quantity/:id")
  .patch(isAuthenticated, isAuthorized(["admin"]), changeQuantity);

productRouter
  .route("/:id")
  .get(isAuthenticated, getSpecificProduct)
  .put(isAuthenticated, isAuthorized(["admin"]), updateProducts)
  .delete(isAuthenticated, isAuthorized(["admin"]), deleteProduct);

export default productRouter;
