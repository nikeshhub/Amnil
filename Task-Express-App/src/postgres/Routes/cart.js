import { Router } from "express";
import { getCart } from "../Controllers/pages.js";
import isAuthenticated from "../../Middlewares/isAuthenticated.js";

const pgCartRouter = Router();

pgCartRouter.route("/").get(isAuthenticated, getCart);

export default pgCartRouter;
