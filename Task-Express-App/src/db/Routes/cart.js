import { Router } from "express";
import { addToCart, getCart } from "../Controller/cart.js";

import dotenv from "dotenv";

dotenv.config();

const cartRouter = Router();

cartRouter.route("/").post(addToCart).get(getCart);

export default cartRouter;
