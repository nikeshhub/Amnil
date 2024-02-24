import { Schema } from "mongoose";

const userSchema = Schema({
  name: {
    type: String,
    required: [true, "Please enter your full name"],
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
  },
  phoneNumber: {
    type: String,
    required: [true, "Please enter your phone number"],
  },
  address: {
    type: String,
    required: [true, "Please enter your address"],
  },
  profilePicture: {
    type: String,
    required: [true, "Please enter your profile photo"],
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
  },
  role: {
    type: String,
    enum: ["buyer", "seller", "admin"],
    required: [true, "Please give user role"],
  },
});
export default userSchema;
