const asyncHandler = (requestHandler) => {
    return (req,res,next) => {
        Promise.resolve(requestHandler(req,res,next)).catch((err) => next(err))
    }
}  // arrow method

// yaha pe return kar dunga promise ke format me

export {asyncHandler}


// const asyncHandler = () => {}
// const asyncHandler = (func) => () =>{}
// const asyncHandler = (func) => async () => {}

// const asyncHandler = (fn) => async (req,res,next) => {  // next for middleware

//     try{
//          await fn(req,res,next)
//     }catch(error){
//           res.status(err.code || 500).json({
//             success:false,   // json response for frontend user ke liye
//             message:err.message

//           })
//     }
// }   // (fn) means parameter me hi function accept kar liya h


// iss same code ko promises me kaise convert karenge ....

