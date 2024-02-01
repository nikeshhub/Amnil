import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const dbUrl = process.env.MONGODB_URI || "mongodb://0.0.0.0:27017/AmnilTasks";

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
