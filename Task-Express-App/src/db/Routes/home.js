import { Router } from "express";
import { getFeaturedProducts } from "../Controller/home.js";

let homeRouter = Router();

homeRouter.route("/").get(getFeaturedProducts);

export default homeRouter;
