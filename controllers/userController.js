import { User } from '../models/User.js';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import sendMail, { sendForgotMail } from '../middleware/sendMail.js';
import TryCatch from '../middleware/TryCatch.js';
import { Order } from '../models/Order.js';

export const register = TryCatch(async (req, res) => {
    const { email, name, phone, password } = req.body;
    let user = await User.findOne({ email });
    if (user)
        return res.status(400).json({
            message: "User Already exists",
        });
    const hashPassword = await bcrypt.hash(password, 10);
    // const category = await new Category({ name, slug: slugify(name) }).save()
    user = {
        name,
        email,
        phone,
        password: hashPassword,
    };
    const otp = Math.floor(Math.random() * 1000000);
    const activationToken = jwt.sign({
        user,
        otp,
    },
        process.env.ACTIVATION_SECRET,
        {
            expiresIn: "5m",
        }
    );
    const data = {
        name,
        otp,
    };
    await sendMail(email, "Unique Bazar", data);
    res.status(200).json({
        message: "Otp send to your mail",
        activationToken,
    });
})


// Save user in Database after varification
export const verifyUser = TryCatch(async (req, res) => {
    const { otp, activationToken } = req.body;
    // console.log(otp, activationToken)
    const verify = jwt.verify(activationToken, process.env.ACTIVATION_SECRET);
    if (!verify)
        return res.status(400).json({
            message: "Otp Expired",
        });
    if (verify.otp !== otp)
        return res.status(400).json({
            message: "Wrong OTP",
        });
    await User.create({
        name: verify.user.name,
        email: verify.user.email,
        phone: verify.user.phone,
        password: verify.user.password,
    })
    res.json({
        message: "User Register"
    })
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
    const { userId } = req.body
    console.log(userId)
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
    const user = await User.findById(req.params.id);
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


//forgot password
export const forgotPassword = TryCatch(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user)
        return res.status(400).json({
            message: "No User with this email",
        });

    const token = jwt.sign({ email }, process.env.Forgot_Secret)

    const data = { email, token };

    await sendForgotMail("Unique Bazar", data);

    user.resetPasswordExpire = Date.now() + 5 * 60 * 1000;

    await user.save();

    res.json({
        message: "Reset Password Link is send to your mail"
    })
})


export const resetPassword = TryCatch(async (req, res) => {
    const decodedData = jwt.verify(req.query.token, process.env.Forgot_Secret);
    const user = await User.findOne({ email: decodedData.email });

    if (!user)
        return res.status(404).json({
            message: "No user with this email"
        });

    if (user.resetPasswordExpire === null)
        return res.status(404).json({
            message: "Token Expired",
        });

    if (user.resetPasswordExpire < Date.now()) {
        return res.status(400).json({
            message: "Token Expired",
        });
    }

    const password = await bcrypt.hash(req.body.password, 10);
    user.password = password;

    user.resetPasswordExpire = null;

    await user.save();

    res.json({ message: "Password Reset" });
});



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
    const { userId } = req.body;
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


