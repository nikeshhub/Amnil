import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../Model/model.js";

dotenv.config();

export let createUser = async (req, res) => {
  let { name, email, phoneNumber, address, password } = req.body;

  try {
    const existingUser = await User.findOne({ email: email });
    try {
    } catch (error) {}
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash(password, 10);
      password = hashedPassword;

      const data = {
        name,
        email,
        phoneNumber,
        address,
        password,
      };
      //save to database

      let result = await User.create(data);
      console.log(result);

      res.send(
        `<script>alert("Registration successful!"); window.location.href = "/user/login";</script>`
      );
    } else {
      res.send(
        `<script>alert("User already exists"); window.location.href = "/user/register";</script>`
      );
    }
    //hash password
  } catch (error) {
    res.render("error", { errorMessage: error.message });
  }
};

export let getRegisterPage = (req, res) => {
  res.render("register");
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
        //store the token in cookie and send it to client side
        res.cookie("token", verificationToken, { httpOnly: true });

        if (email === "nikeshsapkota@gmail.com") {
          res.send(`<script> window.location.href = "/admin";</script>`);
        } else {
          res.send(`<script> window.location.href = "/";</script>`);
        }
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

export let getLoginPage = async (req, res) => {
  res.render("login");
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
