import { Router } from "express";
import { addToCart, getCart } from "../Controller/cart.js";

import dotenv from "dotenv";
import isAuthenticated from "../../Middlewares/isAuthenticated.js";
import isAuthorized from "../../Middlewares/isAuthorized.js";

dotenv.config();

const cartRouter = Router();

cartRouter.route("/").get(isAuthenticated, getCart);

export default cartRouter;
