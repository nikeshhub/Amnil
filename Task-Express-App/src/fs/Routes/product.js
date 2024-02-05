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
} from "../Controllers/product.js";
import isAuthenticated from "../../Middlewares/isAuthenticated.js";
import isAuthorized from "../../Middlewares/isAuthorized.js";
import upload from "../../Middlewares/upload.js";

let fsproductRouter = Router();

fsproductRouter
  .route("/")
  .post(
    isAuthenticated,
    isAuthorized(["admin"]),
    upload.array("files", 5),
    createProduct
  )
  .get(isAuthenticated, getProducts);

fsproductRouter.route("/search").get(isAuthenticated, searchProducts);

fsproductRouter
  .route("/out-of-stock")
  .get(isAuthenticated, isAuthorized(["admin"]), getOutOfStock);

fsproductRouter
  .route("/all")
  .delete(isAuthenticated, isAuthorized(["admin"]), deleteAllProducts);

fsproductRouter
  .route("/quantity/:id")
  .patch(isAuthenticated, isAuthorized(["admin"]), changeQuantity);

fsproductRouter
  .route("/:id")
  .get(isAuthenticated, getSpecificProduct)
  .put(isAuthenticated, isAuthorized(["admin"]), updateProducts)
  .delete(isAuthenticated, isAuthorized(["admin"]), deleteProduct);

export default fsproductRouter;
