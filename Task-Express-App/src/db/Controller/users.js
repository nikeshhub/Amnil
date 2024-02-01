import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../Model/model.js";

dotenv.config();

export let createUser = async (req, res) => {
  let data = req.body;

  try {
    //hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);
    data.password = hashedPassword;
    //save to database
    let result = await User.create(data);

    res.status(201).json({
      success: true,
      message: "Successfully added. Verification email sent.",
      data: result,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export let loginUser = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    //find user with that email
    const user = await User.findOne({ email: email });
    //check if user is in database or not
    if (user) {
      //validate password
      let isPasswordValidated = await bcrypt.compare(password, user.password);
      if (isPasswordValidated) {
        //create authentication token
        let infoObj = {
          _id: user._id,
        };

        let expiryInfo = {
          expiresIn: "365d",
        };
        const verificationToken = await jwt.sign(
          infoObj,
          process.env.SECRET_KEY,
          expiryInfo
        );
        res.json({
          success: true,
          message: "Login successful",
          data: user,
          token: verificationToken,
        });
      } else {
        let error = new Error("Password is wrong");
        throw error;
      }
    } else {
      let error = new Error("User not found");
      throw error;
    }
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export let readAllUsers = async (req, res) => {
  try {
    let result = await User.find();

    res.json({
      success: true,
      message: "Users fetched successfully",
      data: result,
    });
  } catch (error) {
    res.json({
      success: false,
      message: "Data failed to fetch",
    });
  }
};

export let readSpecificUser = async (req, res) => {
  try {
    const UserId = req.params.id;
    const result = await User.findById(UserId);
    res.json({
      success: true,
      message: "User retreived successfully",
      data: result,
    });
  } catch (error) {
    res.json({
      success: false,
      message: "User failed to retreive",
    });
  }
};

export let updateUser = async (req, res) => {
  try {
    const UserId = req.params.id;
    const data = req.body;

    delete data.email;
    delete data.password;
    const result = await User.findByIdAndUpdate(UserId, data, { new: true });
    res.json({
      success: true,
      message: "User updated Successfully!",
      data: result,
    });
  } catch (error) {
    res.json({
      success: false,
      message: `Failed to Update user `,
    });
  }
};

export let deleteUser = async (req, res) => {
  try {
    const UserId = req.params.id;

    const result = await User.findByIdAndDelete(UserId);
    res.json({
      success: true,
      message: "User deleted Successfully!",
      data: result,
    });
  } catch (error) {
    res.json({
      success: false,
      message: `Failed to delete user `,
    });
  }
};
