// ye middleware verify karega ki user h ya nahi  //40:00

import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";

export const verifyJWT = asyncHandler(async(req,res,next) => {
// next() ka kaam h ke apna kaam to ho gaya h khatam , isko aage jaha pe aage leke jana h jao , agle middleware me leke jana h to leke jao ya response me leke jao ...

  try {
      const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer" , "") // bearer keyword ko replace kar diya empty string se   // access token hi use kar rhe h yaha 
  
      if(!token) {
          throw new ApiError(401 , "Unauthorised request")
      }
  
      const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
  
      await User.findById(decodedToken?._id).select("-password -refreshToken")
  
      if(!user) {
          // TODO: discuss about frontend(v-16)
          throw new ApiError(401 , "Invalid Access Token")
      }
      
      req.user = user;    /// naya object
      next()
  } catch (error) {
    throw new ApiError(401 , error?.message || "Invalid access token")
  }
})

// try catch kiya kyoki failure ke chances he 