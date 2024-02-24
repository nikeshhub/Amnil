import { Schema } from "mongoose";

const userSchema = Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
    },
    email: {
      type: String,
      unique: [true, "This email address is already in use"],
      required: [true, "email is required"],
    },
    phoneNumber: {
      type: String,
      required: [true, "phoneNumber is required"],
    },
    address: {
      type: String,
      required: [true, "address is required"],
    },
    password: {
      type: String,
      required: [true, "password is required"],
    },
    role: {
      type: String,
      default: "customer",
      required: [true, "role is required"],
    },
  },
  { timestamps: true }
);

export default userSchema;
