import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const isAuthenticated = async (req, res, next) => {
  try {
    //get token from headers
    const token = req.headers.authorization.split(" ")[1];
    // console.log(token);
    //verify token
    let infoObj = await jwt.verify(token, process.env.SECRET_KEY);
    console.log(infoObj);
    //send id to other

    req._id = infoObj._id;
    next();
  } catch (error) {
    res.json({
      success: false,
      message: "Authentication failed.",
    });
  }
};

export default isAuthenticated;
