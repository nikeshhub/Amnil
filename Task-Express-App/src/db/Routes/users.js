import { Router } from "express";
import {
  createUser,
  deleteUser,
  loginUser,
  readAllUsers,
  readSpecificUser,
  updateUser,
} from "../Controller/users.js";
import isAuthenticated from "../../Middlewares/isAuthenticated.js";
import isAuthorized from "../../Middlewares/isAuthorized.js";

let userRouter = Router();

userRouter
  .route("/")
  .post(createUser)
  .get(isAuthenticated, isAuthorized(["admin"]), readAllUsers);

userRouter.route("/login").post(loginUser);

userRouter
  .route("/:id")
  .get(isAuthenticated, isAuthorized(["admin"]), readSpecificUser)
  .patch(isAuthenticated, isAuthorized(["admin"]), updateUser)
  .delete(isAuthenticated, isAuthorized(["admin"]), deleteUser);

export default userRouter;
