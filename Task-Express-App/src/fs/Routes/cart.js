import { Router } from "express";
import { addToCart, getCart } from "../Controllers/order.js";

const fsCartRouter = Router();

fsCartRouter.route("/").post(addToCart).get(getCart);

export default fsCartRouter;
