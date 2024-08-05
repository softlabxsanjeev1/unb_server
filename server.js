import express from 'express'
import dotenv from "dotenv";
import cors from "cors"
import { dbConnection } from './dbConfig/dbconnect.js';
import morgan from 'morgan'
import cookieParser from "cookie-parser";
import userRoutes from './routes/userRoutes.js'
import categoryRoutes from "./routes/category.js"
import adminRoutes from './routes/admin.js'
import Razorpay from "razorpay"


const app = express();
//configure env file
dotenv.config();
// config database 
dbConnection()

export const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY,
    key_secret: process.env.RAZORPAY_SECRET,
});


const port = process.env.PORT || 5000


// global middlewares use for all routes
// app.use(cors({
//     // origin: [process.env.FRONTEND_URL],
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     credentials: true,
// })
// );
app.use(cors())
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

//this middle wate use to read file from uploads folder
app.use("/uploads", express.static("uploads"));


//test get api
// app.use("/test", (req, res) => {
//     res.send(`Server is running on port no ${port}`);
// })

app.use('/api/user', userRoutes);
// admin and product related controllers in this routes
app.use('/api/admin', adminRoutes);
app.use('/api/category', categoryRoutes);


app.listen(port, () => {
    console.log(`Server listening on port ${port} ........`)
})


app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});