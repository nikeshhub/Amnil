import { Router } from "express";
import { getOrders, makeOrder } from "../Controllers/order.js";

const fsorderRouter = Router();

fsorderRouter.route("/").post(makeOrder).get(getOrders);

export default fsorderRouter;
