import bcrypt from "bcrypt";
import { User } from "../Models/model.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const secretKey = process.env.SECRET_KEY;

export const createUser = async (req, res) => {
  try {
    let data = req.body;
    const checkEmail = await User.findOne({ email: data.email });
    if (checkEmail) {
      throw new Error("User alreafy exists");
    } else {
      const photos = `localhost:8000/${req.file.filename}`;
      const hashedPassword = await bcrypt.hash(data.password, 10);

      data = { ...data, profilePicture: photos, password: hashedPassword };
      console.log(data);

      const result = await User.create(data);
      res.json({
        success: true,
        message: "User created successfully!",
        data: result,
      });
    }
  } catch (error) {
    res.json({
      success: false,
      error: error.message,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (user) {
      const validatePassword = await bcrypt.compare(password, user.password);
      if (validatePassword) {
        const infoObj = {
          _id: user._id,
        };
        const expiryInfo = {
          expiresIn: "365d",
        };

        const token = jwt.sign(infoObj, secretKey, expiryInfo);
        res.json({
          success: true,
          message: "User logged in successfully",
          data: user,
          token: token,
        });
      } else {
        throw new Error("Password is wrong!");
      }
    } else {
      throw new Error("User not found!");
    }
  } catch (error) {
    res.json({
      success: false,
      error: error.message,
    });
  }
};
