import userModel from '../models/userModel.js'
import orderModel from '../models/orderModel.js'
import { comparePassword, hashPassword } from '../helpers/authHelper.js'
import JWT from 'jsonwebtoken'
import productModel from '../models/productModel.js';
import categoryModel from '../models/categoryModel.js';


export const registerController = async (req, res) => {
    try {
        const { name, email, password, phone, address, answer } = req.body
        //validations
        if (!name) {
            return res.send({ message: "Name is required !" })
        }
        if (!email) {
            return res.send({ message: "Email is required !" })
        }
        if (!password) {
            return res.send({ message: "password is required !" })
        }
        if (!phone) {
            return res.send({ message: "Phone number is required !" })
        }
        if (!address) {
            return res.send({ message: "Address is required !" })
        }
        if (!answer) {
            return res.send({ message: "Answer is required !" })
        }
        // if (!role) {
        //     return res.send({ message: "role is required !" })
        // }

        //check user on the bases of one field (email)
        const existingUser = await userModel.findOne({ email });
        //find existing user 
        if (existingUser) {
            return res.status(200).send({
                success: false,
                message: "Already Register please login",
            })
        }

        //register user and hash password fun for new user
        const hashedPassword = await hashPassword(password)
        //save  all data and hashedPassword
        const user = await new userModel({
            name,
            email,
            phone,
            address,
            password: hashedPassword,
            answer
        }).save();

        res.status(201).send({
            success: true,
            message: "User Register successfully",
            user,
        })
    } catch (error) {
        // console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error in Registration',
            error,
        });
    }
};


//POST LOGIN
export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body
        //validation
        if (!email || !password) {
            return res.status(404).send({
                success: false,
                message: "Invalid email or password "
            })
        }
        //check user
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "Email is not registerd"
            })
        }
        // match user password and current login password
        const match = await comparePassword(password, user.password)
        if (!match) {
            return res.status(200).send({
                success: false,
                message: "Invalid Password"
            })
        }
        // token
        const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });
        res.status(200).send({
            success: true,
            message: "logiin successfully",
            user: {
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role,
            },
            token,
        });
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error in login",
            error
        })
    }
}

//test controller
export const testController = (req, res) => {
    res.send("Protected route")
}


//forgot password controller
export const forgotPasswordController = async (req, res) => {
    try {
        const { email, answer, newPassword } = req.body
        if (!email) {
            res.status(400).send({ message: "Email is required" })
        }
        if (!answer) {
            res.status(400).send({ message: "answer is required" })
        }
        if (!newPassword) {
            res.status(400).send({ message: "New Password is requiured" })
        }
        // check
        const user = await userModel.findOne({ email, answer })
        // validation compare these values
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "Wrong Email or Answer"
            });
        }
        const hashed = await hashPassword(newPassword);
        await userModel.findByIdAndUpdate(user._id, { password: hashed });
        res.status(200).send({
            success: true,
            message: "Password Reset Successfully",
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Something went wrong",
            error
        })
    }
}


//update profile
export const updateProfileController = async (req, res) => {
    try {
        const { name, email, password, address } = req.body;
        const user = await userModel.findById(req.user._id);
        // password
        if (password && password.length < 6) {
            return res.json({ error: "Password is required and 6 character long" });
        }
        const hashedPassword = password ? await hashPassword(password) : undefined;
        const updatedUser = await userModel.findByIdAndUpdate(
            req.user._id, {
            name: name || user.name,
            password: hashedPassword || user.password,
            // phone: phone || user.phone,
            address: address || user.address
        },
            { new: true }
        );
        res.status(200).send({
            success: true,
            message: "Profile Updated Successfully",
            updatedUser,
        });
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error while Update profile",
            error
        })
    }
}

//orders
export const getOrdersController = async (req, res) => {
    try {
        const orders = await orderModel
            .find({ buyer: req.user._id })
            .populate("products", "-photo")
            .populate("buyer", "name")
        res.json(orders);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error WHile Geting Orders",
            error,
        });
    }
};


//get all orders
export const getAllOrdersController = async (req, res) => {
    try {
        const orders = await orderModel
            .find({})
            .populate("products", "-photo")
            .populate("buyer", "name")
            .sort({ createdAt: "-1" });
        res.json(orders);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error WHile Geting Orders",
            error,
        });
    }
};

// order status
export const orderStatusController = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        const orders = await orderModel.findByIdAndUpdate(
            orderId,
            { status },
            { new: true }
        );
        res.json(orders);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error While updating Orders",
            error,
        });
    }

}


// Stats
export const statsController = async (req, res) => {
    try {
        const totalUsers = (await userModel.find()).length;
        const totalProducts = (await productModel.find()).length;
        const totalOrders = (await orderModel.find()).length;
        const totalCategoris = (await categoryModel.find()).length;
        const stats = {
            totalUsers,
            totalProducts,
            totalOrders,
            totalCategoris
        };
        res.json(stats);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error While fetching stats",
            error,
        });
    }

}



