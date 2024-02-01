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

let productRouter = Router();

productRouter.route("/").post(createProduct).get(getProducts);

productRouter.route("/search").get(searchProducts);

productRouter.route("/out-of-stock").get(getOutOfStock);

productRouter.route("/all").delete(deleteAllProducts);

productRouter.route("/quantity/:id").patch(changeQuantity);

productRouter
  .route("/:id")
  .get(getSpecificProduct)
  .put(updateProducts)
  .delete(deleteProduct);

export default productRouter;
