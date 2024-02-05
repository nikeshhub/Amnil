import { Router } from "express";
import { getOrders, makeOrder } from "../Controllers/order.js";
import isAuthenticated from "../../Middlewares/isAuthenticated.js";
import isAuthorized from "../../Middlewares/isAuthorized.js";

const fsorderRouter = Router();

fsorderRouter
  .route("/")
  .post(isAuthenticated, isAuthorized(["customer"]), makeOrder)
  .get(isAuthenticated, isAuthorized(["admin"]), getOrders);

export default fsorderRouter;
