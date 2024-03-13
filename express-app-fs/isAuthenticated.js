import jwt from "jsonwebtoken";
import { secretKey } from "./constant.js";

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    // console.log(token);
    let infoObj = await jwt.verify(token, secretKey);
    // console.log(infoObj);
    req.id = infoObj.id;
    next();
  } catch (error) {
    res.json({
      success: false,
      message: "Authentication failed.",
    });
  }
};

export default isAuthenticated;
