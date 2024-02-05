import { Router } from "express";
import { addToCart, getCart } from "../Controller/cart.js";

import dotenv from "dotenv";
import isAuthenticated from "../../Middlewares/isAuthenticated.js";
import isAuthorized from "../../Middlewares/isAuthorized.js";

dotenv.config();

const cartRouter = Router();

cartRouter
  .route("/")
  .post(isAuthenticated, isAuthorized(["customer"]), addToCart)
  .get(isAuthenticated, isAuthorized(["customer"]), getCart);

export default cartRouter;
