import {v2 as cloudinary} from 'cloudinary';

import fs from "fs"


cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: 'gznU-process.env.CLOUDINARY_API_SECRET 
});

const uploadCloudinary = async (localFilePath) => {  // time lega isliye async laga diya

    try {
        if(!localFilePath)  return null

        // upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath,{   
            resource_type:"auto"   // detect automatically 
        })   // ye upload karaya h aur upload karane me time lagega to await laga diya aur response ko hold kara diya variable me

        // file has been uploaded successfully
        // console.log("file is uploaded on cloudinary",response.url);   // video postman time --> 14:00 min 
       fs.unlinkSync(localFilePath)   // to ab ummeed he ke future me jab file upload hogi to agar successfully upload ho gai to bhi remove ho jaygi aur agar error aaya to bhi remove ho jayga  // time-->15:00
    
        return response;

    } catch(error){
         
        fs.unlinkSync(localFilePath)  // remove the locally saved temporary file as the upload operation got failed
        return null
    }
}


export {uploadCloudinary}


// cloudinary.uploader.upload("https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg",
//   { public_id: "olympic_flag" }, 
//   function(error, result) {console.log(result); });