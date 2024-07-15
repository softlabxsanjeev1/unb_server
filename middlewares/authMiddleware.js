import JWT from 'jsonwebtoken';
import userModel from "../models/userModel.js";

//protected route token base this function decode credentials send through header
export const requireSignIn = async (req, res, next) => {
    try {
        const decode = JWT.verify(
            req.headers.authorization,
            process.env.JWT_SECRET
        );
        req.user = decode;
        next();
    } catch (error) {
        console.log(error);
    }
};

//admin access
export const isAdmin = async (req, res, next) => {
    try {
        const user = await userModel.findById(req.user._id);
        if (user.role !== "admin") {
            return res.status(401).send({
                success: false,
                message: "unAuthorized Access",
            });
        } else {
            next();
        }
    } catch (error) {
        res.status(401).send({
            success: false,
            error,
            message: "Error in admin middleware"
        })
        //    console.log(error)
    }
};