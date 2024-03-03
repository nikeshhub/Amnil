import { Router } from "express";

import {
  getDashboard,
  getOrders,
  getProducts,
  getUsers,
} from "../Controllers/admin.js";
import {
  getAddProductsPage,
  getEditProductsPage,
} from "../Controllers/pages.js";
import {
  createProduct,
  deleteProduct,
  makeLimitedProducts,
  updateProducts,
} from "../Controllers/products.js";
import upload from "../../Middlewares/upload.js";

const pgAdminRouter = Router();

pgAdminRouter.route("/").get(getDashboard);
pgAdminRouter.route("/products").get(getProducts);
pgAdminRouter.route("/products/delete/:id").delete(deleteProduct);
pgAdminRouter.route("/products/limited/:id").put(makeLimitedProducts);
pgAdminRouter
  .route("/products/edit/:id")
  .get(getEditProductsPage)
  .put(updateProducts);
pgAdminRouter.route("/customers").get(getUsers);
pgAdminRouter.route("/orders").get(getOrders);
pgAdminRouter
  .route("/products/add")
  .post(upload.single("files"), createProduct)
  .get(getAddProductsPage);

export default pgAdminRouter;
