import { Router } from "express";
import {
  createUser,
  deleteUser,
  loginUser,
  readAllUsers,
  readSpecificUser,
  updateUser,
} from "../Controller/users.js";

let userRouter = Router();

userRouter.route("/").post(createUser).get(readAllUsers);

userRouter.route("/login").post(loginUser);

userRouter
  .route("/:id")
  .get(readSpecificUser)
  .patch(updateUser)
  .delete(deleteUser);

export default userRouter;
