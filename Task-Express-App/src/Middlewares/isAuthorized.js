import fs from "fs/promises";
import dotenv from "dotenv";
import { User } from "../db/Model/model.js";
const jsonPath = "./src/fs/Controllers/user.json";

dotenv.config();

const readUsers = async () => {
  try {
    const fileContent = await fs.readFile(jsonPath, "utf-8");
    return JSON.parse(fileContent);
  } catch (error) {
    throw new Error("Existing data couldn't be fetched");
  }
};

const isAuthorized = (roles) => {
  return async (req, res, next) => {
    try {
      let UserId = req._id;
      // console.log(UserId);

      const fsUsers = await readUsers();

      let user;

      if (process.env.STORE_TO === "DB") {
        user = await User.findById(UserId);
        // console.log(user);
      } else if (process.env.STORE_TO === "FS") {
        console.log("h");
        user = fsUsers.find((value) => value.id === UserId);
        // console.log(user);
      }

      // console.log(user);
      let userRole = user.role;
      // console.log(userRole);
      // console.log(roles);
      if (roles.includes(userRole)) {
        next();
      } else {
        res.status(401).json({
          status: false,
          message: `Not authorized`,
        });
      }
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error.message,
      });
    }
  };
};

export default isAuthorized;
