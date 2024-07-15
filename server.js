import express from "express"
import colors from "colors"
import dotenv from 'dotenv'
import morgan from 'morgan'
import connectDB from "./config/dbconfig.js";
import authRoute from './routes/authRoute.js'
import categoryRoutes from './routes/categoryRoutes.js'
import productRoutes from './routes/productRoutes.js'
import cors from 'cors'

const app = express();

//configure env file
dotenv.config();

//database config
connectDB();


//middlewares
app.use(cors())
app.use(express.json());
app.use(morgan('dev'));

//this middle wate use to read file from uploads folder
app.use("/uploads", express.static("uploads"));


// port
const PORT = process.env.PORT || 8080;

// //rest get api
// app.use("/", (req, res) => {
//     res.send("Welcome to ecom site");
// })

//Routes
app.use('/api/v1/auth', authRoute);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/product", productRoutes);

// run listen
app.listen(PORT, () => {
    console.log(colors.red(`Server is in  ${process.env.DEV_MODE} mode running on ${PORT}`.bgCyan.white))
})


// conatin main route