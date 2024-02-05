import { Router } from "express";
import { getOrders, makeOrder } from "../Controller/order.js";
import isAuthenticated from "../../Middlewares/isAuthenticated.js";
import isAuthorized from "../../Middlewares/isAuthorized.js";

const orderRouter = Router();

orderRouter
  .route("/")
  .post(isAuthenticated, isAuthorized(["customer"]), makeOrder)
  .get(isAuthenticated, isAuthorized(["admin"]), getOrders);

export default orderRouter;
