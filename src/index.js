// require('dotenv').config({path : './env'})

import dotenv from "dotenv"

// import mongoose from "mongoose";
// import {DB_NAME} from "./constants"
import connectDB from "./db/index";



dotenv.config({
    path: './env'
})

connectDB()
.then(() =>{
    app.listen(process.env.PORT || 8000 , () => {
console.log(`Server is running at port : ${process.env.PORT}`);
    })
})

.catch((err) =>{
console.log("MONGO db connection failed !!!",err);
})
