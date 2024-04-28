import { asyncHandler } from "../utils/asyncHandler.js";  //

const registerUser = asyncHandler( async (req ,res) =>{
     res.status(200).json({
        message:"ok"
    })
})   // ye method ka kaam he  register karega user ko
// async ke ander req and res hota h  ..

export {registerUser}
