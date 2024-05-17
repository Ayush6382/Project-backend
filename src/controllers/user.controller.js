import { asyncHandler } from "../utils/asyncHandler.js";  //

import { ApiError } from "../utils/ApiError.js";

import {User} from "../models/user.model.js"  // importing to check user already exist or not

import { uploadOnCloudinary } from "../utils/cloudinary.js";  // for 5th point(upload to cloudinary)

import { ApiResponse } from "../utils/ApiResponse.js";

import jwt from "jsonwebtoken" 

const generateAccessAndRefereshTokens = async(userId) => {
    try{
        const user = await User.findById(userId)// user ka document aa gaya h and we will generate token in next line 
        const accessToken = user.generateAccessAndRefereshTokens()
        const refreshToken = user.generateRefreshToken()

        // refresh token ko database me kaise daale (user joh vo object h , isme saari properties h ) so object ke ander value kaise add karte h 

        user.refreshToken = refreshToken
        await user.save({validateBeforeSave : false})// save bhi karana padega (mongoose se aaya h save) 23:00 time  (database ka operation h to await kara do)
        
        return {accessToken , refreshToken}

        
    } catch (error) {
        throw new ApiError(500 , "Something went wrong while generating refresh and access token")
     }

} // yaha pe asyncHandler ki zarurat ni h kyoki koi web request handle nahi kar rhe h (ye vhi method create kar rhe h access token ka )

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

if (  // check ki kahi empty string to pass ni kar di
    [fullName,email,username,password].some((field)=>
field?.trim()==="")
) {
      throw new ApiError(400 , "All fields are required")

}

const existedUser = await User.findOne({
    $or: [{ username } , { email }]
})

  if(existedUser){
    throw new ApiError(409, "User with email or username already exist")  // ApiError file bana ke rakhi h isliye hum ye use kar paa rhe h 
  }

// console.log(req.files);   aise hi sab print karke dekh lo sab to know what we are getting(v-14 , 17:00)

//4)for avatar  
const avatarLocalPath = req.files?.avatar[0]?.path;  // file ko avatar bola h isliye avatar  in user.routes

// const coverImageLocalPath = req.files?.coverImage[0]?.path   //[0] jo first property he ho sakta h usse hame path mil jay

// classic way to check coverimage he bhi ya nhi aur phir hum aage badhe

let coverImageLocalPath;

if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0) {
    coverImageLocalPath = req.files.coverImage[0].path
}

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

const loginUser = asyncHandler(async (req,res) => {

    // req body -> data
    // username or email
    // find the user
    // password check
    // access and refresh token
    // send cookie (tokens ko cookies me bhejte h )

//   1)

      const {email , username , password} = req.body   // email ya username pe hoga abhi decide nahi kiya h
      
      if(!(username || email)) {
        throw new ApiError(400 , "Username or email is required")
      }

    const user = await User.findOne({
        $or: [{username} , {email}]
    })   // uper jo user import kiya h whi user h
     
    if(!user) {
        throw new ApiError(404 , "User does not exist")
    }

// User mongodb mongoose ka ek object h to hme ye use nahi karna h (capital U)wala  ,  findOne method jo h ye mongoose se available h (time 15:00 v-access token)

const isPasswordValid = await user.isPasswordCorrect(password)  // binary

if(!isPasswordValid) {
    throw new ApiError(401 , "Invalid user credentials")
}

// for access and refresh token ye itna common h (will use it many times ) to isko seperate method me daal dete h   , ki jab bhi dono generate karna ho to ye method call kardo  

const { accessToken , refreshToken} = await generateAccessAndRefereshTokens(user._id)  // generate access me time lag sakta he to await laga // is method se 2 milenge aur humne unko variable me store kar liya


const loggedInUser = await User.findById(user._id).select("-password -refreshToken") // ye field nahi chahiye // step optional tha  // user ko password nahi bhejna chahiye

// ab cookies me bhejo(6th)(28:00)

    const options = {
        httpOnly: true, 
        secure:true

        // bydefault cookies ko koi bhi modify kar sakta h frontend se but ye dono se cookies sirf server se modifyable hoti h 
    }

    return res.status(200)
    .cookie("accessToken", accessToken , options)
    .cookie("refreshToken",refreshToken,options)
    .json(    // sending json response
        new ApiResponse(
            200,
            {
                user:loggedInUser , accessToken,refreshToken
            },
            "User logged In Successfully"
        )
    )

})

// hum user ko logout nahi karwa paa rhe the isliye middleware banaya kyoki access ni tha merepass
const logoutUser = asyncHandler(async(req,res) => { // think ki jab logout pe click karega to logout kar kaise sakta hu  // 35:00

    //  req.user._id  // id aa gai -> userobject le aunga -> and then refresh token delete kar dunga or log out ho jayga
    
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {  // opetrator h 
                refreshToken:undefined
            }
        },
        {
            new:true
        }
    )

    const options = {
        httpOnly: true, 
        secure:true
    }

    return res
    .status(200)
    .clearCookies("accessToken" , options)
    .clearCookies("refreshToken" , options)
    .json(new ApiResponse(200 , {} , "User logged Out"))

})

// v - 16   
const refreshAccessToken = asyncHandler(async (req,res) => {
  // refreshtoken kaha se aayga ==> cookies se access kar sakte ho   
})

const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

if(incomingRefreshToken) { // refreshtoken nahi mila to --> if condition laga diya
    throw new ApiError(401 , "unauthorized request")  // kyoki token hi sahi ni h 
}

// ab incoming token ko verify bhi karna padega , verify hone ke baad decoded token milega

const decodedToken = jwt.verify(
    incomingRefreshToken , process.env.REFRESH_TOKEN_SECRET
)
 
// mongodb se _id ki help se user ki information le sakte h  // kaunsa user find karna h vo decodedtoken me rakha h // await because database to dusre continent me hi hota h 
const user = await User.findById(decodedToken?._id)

  if(!user) {//agar user nahi h to if laga diya
    throw new ApiError(401 , "Invalid refresh token")   
  }

   if(incomingRefreshToken !== user?.refreshToken) {
    throw new ApiError(401 , "Refresh token is expired or used")
   }

   

export {registerUser ,
    loginUser,
    logoutUser
}


