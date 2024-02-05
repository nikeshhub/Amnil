import { Router } from "express";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getSpecificUser,
  loginUser,
  updateUser,
} from "../Controllers/user.js";
import isAuthenticated from "../../Middlewares/isAuthenticated.js";
import isAuthorized from "../../Middlewares/isAuthorized.js";

let fsUserRouter = Router();

fsUserRouter
  .route("/")
  .post(createUser)
  .get(isAuthenticated, isAuthorized(["admin"]), getAllUsers);

fsUserRouter.route("/login").post(loginUser);

fsUserRouter
  .route("/:id")
  .get(isAuthenticated, isAuthorized(["admin"]), getSpecificUser)
  .patch(isAuthenticated, isAuthorized(["admin"]), updateUser)
  .delete(isAuthenticated, isAuthorized(["admin"]), deleteUser);

export default fsUserRouter;
