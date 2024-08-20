import { User } from '../models/User.js';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import sendMail from '../middleware/sendMail.js';
import TryCatch from '../middleware/TryCatch.js';
import { Order } from '../models/Order.js';
import { Products } from '../models/Products.js';

export const register = TryCatch(async (req, res) => {
    const { email, name, phone, password } = req.body;
    let user = await User.findOne({ email });
    if (user)
        return res.status(400).json({
            message: "User Already exists",
        });
    const hashPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(Math.random() * 1000000);
    const data = { name, otp };
    const userdata = await User.create({
        name,
        email,
        phone,
        otp,
        password: hashPassword
    })
    await sendMail(email, "Unique Bazar", data);
    res.status(200).json({
        message: "Otp send to your mail",
        userdata
    });
})


// verify user 
export const verifyUser = TryCatch(async (req, res) => {
    const { otp, email } = req.body;
    // console.log(email)
    const user = await User.findOne({ email });
    if (!user)
        return res.status(400).json({
            message: "No User with this email",
        });
    const matchOtp = await user.otp == otp;
    if (!matchOtp)
        return res.status(400).json({
            message: "wrong Otp",
        });
    user.otp = "verified"
    await user.save()
    res.status(200).json({
        message: `Welcome back ${user.name}`,
    });
});


// login user 
export const loginUser = TryCatch(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user)
        return res.status(400).json({
            message: "No User with this email",
        });
    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword)
        return res.status(400).json({
            message: "wrong Password",
        });
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "15d",
    });
    res.json({
        message: `Welcome back ${user.name}`,
        token,
        user
    });
});



//forgot password  get mail send otp and set otp = new otp ress=> otp and email
export const forgotPassword = TryCatch(async (req, res) => {
    let { email } = req.body;
    console.log(email)
    email = JSON.parse(email)
    const user = await User.findOne({ email });
    if (!user)
        return res.status(400).json({
            message: "No User with this email",
        });
    const otp = Math.floor(Math.random() * 1000000);
    const data = { email, otp };
    await sendMail(email, "Unique Bazar", data);
    user.otp = otp,
        await user.save();
    res.json({
        message: "Otp send to your mail",
        email
    })
})


// reset password get mail and new password
export const resetPassword = TryCatch(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user)
        return res.status(404).json({
            message: "No user with this email"
        });
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();
    res.json({ message: "Password Reset" });
});


// add address  
export const addAddress = TryCatch(async (req, res) => {
    const { userId, address } = req.body
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    //add the new address to user's addresses array
    user.addresses.push(address);
    //save updated user in dat base
    await user.save();
    res.status(200).json({ message: "Address created successfully" })

})

// get all address of particular user 
export const getAddresses = TryCatch(async (req, res) => {
    const userId = req.params.id
    // console.log(userId)
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    //get all addresses
    const addresses = user.addresses;
    res.status(200).json({ addresses })
})

// update profile
export const updateProfile = TryCatch(async (req, res) => {
    const { name, password, phone, gender, age } = req.body;
    const userId = req.params.id
    // console.log(name, age)
    // console.log(userId)
    const user = await User.findById(userId);
    const hashedPassword = await bcrypt.hash(password, 10);
    const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
            name: name || user.name,
            password: hashedPassword || user.password,
            phone: phone || user.phone,
            gender: gender || user.gender,
            age: age || user.age,
        },
        { new: true }
    );
    res.json({
        message: "Profile Updated success fully",
        updatedUser
    });
});

// fetch own profile
// export const myProfile = TryCatch(async (req, res) => {
//     const user = await User.findById(req.user._id);
//     res.json({
//         message: "Your profile",
//         user
//     });
// });


// order placed 
export const placeOrder = TryCatch(async (req, res) => {
    const { userId, cartItems, shippingAddress, totalPrice } = req.body;
    console.log(userId, cartItems, shippingAddress, totalPrice)
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    //create any array of product objects from the cart Items
    const products = await cartItems.map((item) => ({
        name: item?.name,
        productId: item?.productId,
        quantity: item.qty,
        price: item.price,
    }));
    //create new order
    const order = await Order.create({
        user: userId,
        products: products,
        totalPrice: totalPrice,
        shippingAddress: shippingAddress,
    })
    user.orders.push(order._id)
    res.status(200).json({
        message: "Order Created successfully",
    })
})


// get my order 
export const myOrder = TryCatch(async (req, res) => {
    const userId = req.params.id;
    // console.log(userId)
    const orders = await Order
        .find({ user: userId })
        .populate("user")
        .sort({ createdAt: -1 });

    if (!orders || orders.length === 0) {
        return res.status(404).json({ message: "No orders found for this user" })
    }
    res.json({
        message: "Order fetched successfully",
        orders
    });
});


// get all products according to category
export const getProducts = TryCatch(async (req, res) => {
    const slug = req.params.slug;
    // console.log(slug)
    const products = await Products.find({ slug: { $regex: slug, } });
    // console.log(products)
    res.status(200).json({
        // category,
        products,
    })
})


// Search product according to keyword
export const searchProducts = TryCatch(async (req, res) => {
    const keyword = req.params.search;
    // console.log(keyword)
    const products = await Products.find({
        $or: [
            { name: { $regex: keyword, $options: 'i' } },
            { description: { $regex: keyword, $options: 'i' } },
        ],
    })
    res.status(200).json({
        products,
    })
})


