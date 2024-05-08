import { asyncHandler } from "../utils/asyncHandler.js";  //

import { ApiError } from "../utils/ApiError.js";

import {User} from "../models/user.model.js"  // importing to check user already exist or not

import { uploadOnCloudinary } from "../utils/cloudinary.js";  // for 5th point(upload to cloudinary)

import { ApiResponse } from "../utils/ApiResponse.js";


const registerUser = asyncHandler( async (req ,res) =>{
     
    // get user details from frontend
    //validation- not empty
    // check if user already exists:username , email 
    // check for images , check for avatar
    // upload them to  cloudinary , avatar
    // create user object - create entry in db (object isliye kyoki mongodb me jab data bhejunga to no sql database h to object hi jate h mostly(User hi database se baat kar rha h ))
    
    // remove password and refresh token field from response  (jaise hi entry karte ho mongodb me to sara as it is response me aa jata h (to user ke paas password aur refresh token hum chahte he jay))
    // check for user creation 
    // return response

   
    // 1)
      
   const { fullName , email , username , password} = req.body   // destructuring

   console.log("email :",email);

//    if (fullName==="") {
//     throw new ApiError(400,"fullname is required")
//    }  check kar lenge saaare field aise hi or 2nd method is ...down

if (
    [fullName,email,username,password].some((field)=>
field?.trim()==="")
) {
      throw new ApiError(400 , "All fields are required")

}

const existedUser = User.findOne({
    $or: [{ username } , { email }]
})

  if(existedUser){
    throw new ApiError(409, "User with email or username already exist")  // ApiError file bana ke rakhi h isliye hum ye use kar paa rhe h 
  }


//4)for avatar  
const avatarLocalPath = req.files?.avatar[0]?.path;  // file ko avatar bola h isliye avatar  in user.routes

const coverImageLocalPath = req.files?.coverImage[0]?.path   //[0] jo first property he ho sakta h usse hame path mil jay

if(!avatarLocalPath){
    throw new ApiError(400 , "Avatar file is required")
}

// 5th point to upload on cloudinary

const avatar = await uploadOnCloudinary(avatarLocalPath)  /// await lagaya h kyoki me nahi chahta ki code aage badhe jab tak ye upload ni hota

const coverImage = await uploadOnCloudinary(coverImageLocalPath)

// avatar is required field so we r using if statement

if(!avatar){
    throw new ApiError(400 , "Avatar file is required")
}

// 6th point (entry in database)  User hi database se baat kar rha h 

const user = await User.create({
    fullName,
    avatar:avatar.url,
    coverImage:coverImage?.url || "",  // agar coverimage nahi h to empty rahe
    email,
    password,
    username:username.toLowerCase()
})

const createUser = await User.findById(user._Id).select(
    "-password -refreshToken"    // ye field humko nahi chahiye(7th point)
)

if(!createdUser){
    throw new ApiError(500 , "Something went wrong while registering the user")
} // (checked for user creation)


// for 8th (return a response) we need help of ApiResponse.js

return res.status(201).json(
    new ApiResponse(200, createdUser , "User registered Successfully")
)

})   // ye method ka kaam he  register karega user ko
// async ke ander req and res hota h  ..

export {registerUser}


