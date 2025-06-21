import mongoose from "mongoose";
import app from "./app";
import dotenv from "dotenv";
dotenv.config();
const port = 3000;
let server;
const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("MongoDB with Mongoose connect successfully!!");
    server = app.listen(port, () => {
      console.log(`BootStack server is running on port ${port}!!!`);
    });
  } catch (error) {
    console.log(error);
  }
};

connect();
