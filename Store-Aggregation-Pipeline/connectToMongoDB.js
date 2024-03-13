import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();
let dbUrl = process.env.MONGODB_URI;
//connect mongodb
let connectToMongoDb = async () => {
  try {
    await mongoose.connect(dbUrl);
    console.log(
      `application is connected to mongodb at port ${dbUrl} successfully.`
    );
  } catch (error) {
    console.log(error.message);
  }
};
export default connectToMongoDb;
