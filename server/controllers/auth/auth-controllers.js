const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');

//register //take info from form onSubmit, put in db
const registerUser = async (req, res) => {
    const { userName, email, password } = req.body;

    try {
        //check if email/user already exists
        const checkemail = await User.findOne({ email: email.toLowerCase() });
        if (checkemail) {
            return res.json({
                success: false,
                message: "This email already exists. Please try again.",
            });
        }

        //hash the password
        const hashPassword = await bcrypt.hash(password, 12);

        //create a new user
        const newUser = new User({
            userName,
            email,
            password : hashPassword
        })

        //save the new user to database
        await newUser.save()

        //send success response
        res.status(200).json({
            success: true,
            message: "Registration Successful."
        })
    } catch (e) {
        res.status(500).json({
            success: false,
            message: "Some error occured."
        })
    }
}


//login
const loginUser = async (req, res) => {
    const { userName, email, password } = req.body;

    try {
        const checkemail = await User.findOne({ email: email.toLowerCase() });
        if (!checkemail) {
            return res.json({
                success: false,
                message: 'User doesnt exist'
            })
        }

        const checkPasswordMatch = await bcrypt.compare(password, checkemail.password);
        if (!checkPasswordMatch) {
            return res.json({
                success: false,
                message: 'Password is incorrect.'
            })
        }

        const token = jwt.sign(
            {
                id: checkemail._id,
                role: checkemail.role,
                email: checkemail.email,
                userName: checkemail.userName,
            },
            "CLIENT_SECRET_KEY",
            { expiresIn: "60m" }
        );

        res.cookie("token", token, { httpOnly: true, secure: false }).json({
            success: true,
            message: "Logged in successfully.",
            user: {
                id: checkemail._id,
                role: checkemail.role,
                email: checkemail.email,
                userName: checkemail.userName,
            },
        });

    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "An error occured when logging in."
        })
    }
}


//logout
const logoutUser = (req, res) => {
    res.clearCookie('token').json({
        success: true,
        message: 'User logged out successfully.'
    })
}

//auth middleware
const authMiddleware = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized user.'
        })
    }

    try {
        const decoded = jwt.verify(token, 'CLIENT_SECRET_KEY');
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Unauthorized user!'
        })
    }
}

module.exports = {registerUser, loginUser, logoutUser, authMiddleware};