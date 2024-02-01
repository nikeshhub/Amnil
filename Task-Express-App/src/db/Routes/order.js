import { Router } from "express";
import { getOrders, makeOrder } from "../Controller/order.js";

const orderRouter = Router();

orderRouter.route("/").post(makeOrder).get(getOrders);

export default orderRouter;
