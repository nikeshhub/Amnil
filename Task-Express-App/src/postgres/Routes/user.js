import { Router } from "express";
import { createUser, loginUser } from "../Controllers/user.js";
import { getLoginPage, getRegisterPage } from "../Controllers/pages.js";

const pgUserRouter = Router();

pgUserRouter.route("/register").post(createUser).get(getRegisterPage);
pgUserRouter.route("/login").post(loginUser).get(getLoginPage);

export default pgUserRouter;
