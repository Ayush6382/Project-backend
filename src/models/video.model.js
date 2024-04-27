import mongoose, {Schema} from "mongoose";

import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"

const videoSchema =new Schema(
    {
        videoFile: {
            type:String,  // cloudinary url
            required:true

        },
        thumbnail:{
            type:String,  // cloudinary url
            required:true
        },

        title:{
            type:String,  // 
            required:true
        },
        description:{
            type:String,  // 
            required:true
        },

        duration:{
            type:Number,
            required:true
        },

        views:{
            type:Number,
            default:0
        },

        isPublished:{    // videos publicly avilable he ya nahi usi ka boolean flag he
            type:Boolean,
            default:true

        },

        owner:{
            type:Schema.Types.ObjectId,
            ref:"User"
        }
    },
    {
        timestamps:true
    }
)

videoSchema.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model("Video",videoSchema)
