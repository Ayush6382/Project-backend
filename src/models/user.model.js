import mongoose , {Schema} from "mongoose";

import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new Schema(
    {
        username:{
            type:String,
            required:true,
            unique:true,
            lowecase:true,
            trim:true,
            index:true 
        },

        email:{
            type:String,
            required:true,
            unique:true,
            lowecase:true,
            trim:true

        },

        fullName:{
            type:String,
            required:true,
            trim:true,
            index:true 
        },

        avatar:{
            type:String,  // cloudinary url
            required:true
        },

        coverImage:{
            type:String, //cloudinary url
        },

        watchHistory:[    // array he kyoki multiple values add karte jayenge isme
          {
            type:Schema.Types.ObjectId,
            ref:"Video"
          }

        ],

        password:{
            type:String,
            required:[true,'Password is required']
        },

        refreshToken:{
            type:String
        }
    },
    {
timestamps:true
    }

)

userSchema.pre("save", async function (next) {
      if(!this.isModified("pasword")) return next();  // syntax and logic

    this.password = await bcrypt.hash(this.password , 10)// password field ko lo aur encrypt karke save kar do // password ka process jab complete hoga usme lagega time so await laga diya h 
     next()  //( problem khadi ho gai -- jab bhi data save hoga har baar password ko save karega i.e. har baar password encrytpt ni karana ( for that we have used if condition))
                  
})  // functioning me time lagta h is liye async laga diya h 
// ye middleware h isliye flag - next ka access to hona hi chahiye 

// jab end me kaam ho jayga to next ko call karna padta h ki ye flag aage pass kar do

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)   // this.password encrypted wala h and password user ne jo dala h vo h     ...  cryptography h  to time lagta h to await karna padega...  (it will return true or false match hua ke nahi)
} 

// jitn e method chahiye utne method hum schema me inject kar sakte h 

userSchema.Schema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email:this.email,
            username: this.username,
            fullName:this.fullName

// fullName and all above vo payload ka naam h (key h)  , this.fullName database se aa rhi h 
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY

        }
    )
}
userSchema.Schema.methods.generateRefreshToken = function(){

    return jwt.sign(
        {
            _id: this._id,
        },

        process.env.ACCESS_REFRESH_SECRET,
        {
            expiresIn:process.env.ACCESS_REFRESH_EXPIRY
        
        }
    )
}


export const User = mongoose.model("User",userSchema)  // ye jo user h ye database se direct contact kar sakta he kyoki ye mongoose ke through bana h (and will use the user many times(ex. to check user already exist or not))

