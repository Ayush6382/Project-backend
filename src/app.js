import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()
// app ka naam kuch bhi rakh sakte h (app common naam he isliye rakha h )


app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())


// routes import
import userRouter from './routes/user.routes.js'

// routes declaration
app.use("/api/v1/users",userRouter)   // yaha pe ab kuch change ni aayga kyoki jaise hi /user hua control pass ho gaya h , kaha pe -->  user.routes pe 

// http://localhost:8000/api/v1/user/register

export { app } 
// we can use default also(upto you )
