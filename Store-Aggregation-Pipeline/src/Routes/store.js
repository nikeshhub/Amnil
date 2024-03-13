import { Router } from "express";
import { createStore, storesNearby } from "../Controllers/store.js";
import isAuthenticated from "../Middlewares/isAuthenticated.js";
import upload from "../Middlewares/upload.js";

const storeRouter = Router();

storeRouter
  .route("/")
  .post(isAuthenticated, upload.single("logo"), createStore);

storeRouter.route("/nearby").post(storesNearby);

export default storeRouter;
