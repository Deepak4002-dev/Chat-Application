import mongoose from "mongoose";
import {MONGODB_URI} from './constants.js'

const connectDB = async () => {
  try {
    
    const conn = await mongoose.connect(`${MONGODB_URI}`);
    mongoose.connection.on("connected", () => {
      console.log("mongodb connected successfully", mongoose.connection.host);
    });
  
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export default connectDB;
