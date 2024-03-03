import { Router } from "express";
import isAuthenticated from "../../Middlewares/isAuthenticated.js";
import { makeOrder } from "../Controllers/order.js";

const pgOrderRouter = Router();

pgOrderRouter.route("/").post(isAuthenticated, makeOrder);

export default pgOrderRouter;
