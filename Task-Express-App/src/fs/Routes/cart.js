import { Router } from "express";
import { addToCart, getCart } from "../Controllers/order.js";
import isAuthenticated from "../../Middlewares/isAuthenticated.js";
import isAuthorized from "../../Middlewares/isAuthorized.js";

const fsCartRouter = Router();

fsCartRouter
  .route("/")
  .post(isAuthenticated, isAuthorized(["customer"]), addToCart)
  .get(isAuthenticated, isAuthorized(["customer"]), getCart);

export default fsCartRouter;
