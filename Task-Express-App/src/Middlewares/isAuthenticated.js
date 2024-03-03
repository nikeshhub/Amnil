import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const isAuthenticated = async (req, res, next) => {
  try {
    // Get token from cookies
    const token = req.cookies.token;

    // console.log(token);

    if (!token) {
      throw new Error("Token not found");
    }

    // Verify token
    const infoObj = await jwt.verify(token, process.env.SECRET_KEY);
    // console.log(infoObj);

    // Attach decoded user information to request object
    req._id = infoObj._id;

    next();
  } catch (error) {
    res.send(
      `<script>alert("You need to login to access this feature"); window.location.href = "/user/login";</script>`
    );
  }
};

export default isAuthenticated;
