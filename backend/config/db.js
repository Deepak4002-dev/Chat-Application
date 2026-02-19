import mongoose, { Mongoose } from "mongoose";
import {DB_NAME,MONGODB_URI} from './constants.js'

const connectDB = async () => {
  try {
    
    const conn = await mongoose.connect(`${MONGODB_URI}/${DB_NAME}`);
    console.log(MONGODB_URI,DB_NAME)

    mongoose.connection.on("connected", () => {
      console.log("mongodb connected successfully", mongoose.connection.host);
    });
  
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export default connectDB;
