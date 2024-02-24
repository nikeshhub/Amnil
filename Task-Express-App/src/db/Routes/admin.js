import { Router } from "express";
import {
  getAddProductsPage,
  getDashboard,
  getEditProductsPage,
  getOrders,
  getProducts,
  getUsers,
} from "../Controller/admin.js";
import {
  bidProducts,
  createProduct,
  deleteProduct,
  makeLimitedProducts,
  updateProducts,
} from "../Controller/products.js";
import isAuthenticated from "../../Middlewares/isAuthenticated.js";
import isAuthorized from "../../Middlewares/isAuthorized.js";
import upload from "../../Middlewares/upload.js";

const adminRouter = Router();

adminRouter.route("/").get(getDashboard);
adminRouter.route("/customers").get(getUsers);
adminRouter.route("/products").get(getProducts);
adminRouter.route("/orders").get(getOrders);
adminRouter
  .route("/products/add")
  .post(
    isAuthenticated,
    isAuthorized(["admin"]),
    upload.array("files", 5),
    createProduct
  )
  .get(getAddProductsPage);

adminRouter
  .route("/products/edit/:id")
  .get(getEditProductsPage)
  .put(updateProducts);

adminRouter.route("/products/limited/:id").put(makeLimitedProducts);
adminRouter.route("/products/bid/:id").post(isAuthenticated, bidProducts);

adminRouter.route("/products/delete/:id").delete(deleteProduct);

export default adminRouter;
