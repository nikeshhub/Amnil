import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const secretKey = process.env.SECRET_KEY;

const isAuthenticated = (req, res, next) => {
  try {
    //get token from headers
    const token = req.headers.authorization.split(" ")[1];
    //verify token
    const infoObj = jwt.verify(token, secretKey);
    //send token to another middleware
    req._id = infoObj._id;
    next();
  } catch (error) {
    res.json({
      success: true,
      message: error.message,
    });
  }
};
export default isAuthenticated;
