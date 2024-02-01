import { Router } from "express";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getSpecificUser,
  loginUser,
  updateUser,
} from "../Controllers/user.js";

let fsUserRouter = Router();

fsUserRouter.route("/").post(createUser).get(getAllUsers);

fsUserRouter.route("/login").post(loginUser);

fsUserRouter
  .route("/:id")
  .get(getSpecificUser)
  .patch(updateUser)
  .delete(deleteUser);

export default fsUserRouter;
