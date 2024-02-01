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

let fsproductRouter = Router();

fsproductRouter.route("/").post(createProduct).get(getProducts);

fsproductRouter.route("/search").get(searchProducts);

fsproductRouter.route("/out-of-stock").get(getOutOfStock);

fsproductRouter.route("/all").delete(deleteAllProducts);

fsproductRouter.route("/quantity/:id").patch(changeQuantity);

fsproductRouter
  .route("/:id")
  .get(getSpecificProduct)
  .put(updateProducts)
  .delete(deleteProduct);

export default fsproductRouter;
