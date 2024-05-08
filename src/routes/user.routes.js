import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";

import { upload } from "../middlewares/multer.middleware.js";
// middleware means jo bich me execute hota h (milte hue jana )


const router = Router()

router.route("/register").post(
    upload.fields([
       {
        name:"avatar",
        maxCount:1    /// ye middleware inject kiya h , ki jo bhi method execute ho rha h uske just pehle execute karlo  /// isse images bhej paoge
       },
       {
        name:"coverImage",
        maxCount:1
       }
    ]),
    registerUser)


export default router