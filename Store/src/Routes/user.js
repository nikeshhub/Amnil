import { Router } from "express";
import { createUser, loginUser } from "../Controllers/user.js";
import upload from "../Middlewares/upload.js";

const userRouter = Router();

userRouter.route("/").post(upload.single("profilePicture"), createUser);
userRouter.route("/login").post(loginUser);

export default userRouter;
