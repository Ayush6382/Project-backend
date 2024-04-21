// iss file me mongoose ke through database connect karunga so mongoose import karunga

import mongoose from "mongoose";
import {DB_NAME} from "../constants.js";

const connectDB = async () => {
    try {
        // connectionInstance ke ander ek response aa rha h
          const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
          console.log(`\n MONGODB connected !! DB HOST: ${connectionInstance.connection.host}`);
    } catch(error) {
        console.log("MONGODB connection error",error);
        process.exit(1)
    }
}

export default connectDB
 