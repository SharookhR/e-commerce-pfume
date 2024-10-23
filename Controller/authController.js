const User = require('../Model/UserModel')
const tempUser = require('../Model/tempUser')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { generateAccessToken, generateRefreshToken } = require('../utility/token')
const { generateOtp, sendOtpEmail } = require('../utility/otputility')
const resetUser = require("../Model/otpModel")

const renderLogin = async (req, res) => {
    try {
        return res.render('login');
    } catch (error) {
        console.log(error);

    }

};




const renderSignUp = async (req, res) => {

    try {
        return res.render('signup')
    } catch (error) {
        console.log(error);

    }
}

const renderAdminLogin = async (req, res) => {



    try {
        res.render('adminlogin');

    } catch (error) {

        console.log(error);
    }

}


const adminlogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.render('adminlogin', { errorMessage: "Invalid email or password" });
        }

        if (!user.isAdmin) {
            return res.render('adminlogin', { errorMessage: "You are not an admin" });
        }

        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 10 * 60 * 1000
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 30 * 24 * 60 * 60 * 1000
        });

        return res.redirect('/admin/dashboard');
    } catch (error) {
        console.log(error);
        return res.render('adminlogin', { errorMessage: "Server error occurred" });
    }
};


const renderOtpPage = async (req, res) => {


    try {
        const token = req.cookies.token;

        if (!token) {
            return res.redirect('/auth/signup')
        }
        return res.render('otp')
    } catch (error) {
        console.error('Token verification failed:', error);
        return res.redirect('/auth/signup');
    }

}

const signup = async (req, res) => {


    try {
        const { name, password, email, mno } = req.body
        const existence = await User.findOne({ email })
        if (existence) {
            return res.render('signup', { errorMessage: "User already exist" })

        }

        const spass = await bcrypt.hash(password, 10)
        const user = new tempUser({
            name,
            email,
            phone: mno,
            password: spass


        })
        await user.save()

        const { otp, otpExpiresAt } = generateOtp();
        user.otp = otp;
        user.otpExpiresAt = otpExpiresAt;
        await user.save();

        await sendOtpEmail(user.email, otp);

        const userId = user._id
        const token = jwt.sign({ userId }, process.env.JWT_OTP_TOKEN, { expiresIn: '15m' })

        res.cookie('token', token, {
            httpOnly: false,
            maxAge: 10 * 60 * 1000
        })
        return res.redirect('/auth/signup/otp');
    } catch (error) {
        console.log(error);
    }
}



const verifyOtp = async (req, res) => {
    try {
        const userId = req.userId
        const { otp } = req.body

        const tempUserData = await tempUser.findById(userId)

        if (!tempUserData.otp) {
            return res.render('otp', { errorMessage: "No OTP found" })
        }

        if (otp === tempUserData.otp) {
            if (Date.now() > tempUserData.otpExpiresAt) {
                return res.render('otp', { errorMessage: "OTP expired" })

            }
            const user = new User({
                name: tempUserData.name,
                email: tempUserData.email,
                password: tempUserData.password,
                phone: tempUserData.phone,

            })

            await user.save()
            return res.redirect('/auth/login')

        }
        else {
            return res.render('otp', { errorMessage: "Invalid OTP" })

        }
    } catch (error) {
        console.log(error);
    }
}

const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await User.findOne({ email })
        if (!user || !(await user.comparePassword(password))) {
            return res.render('login', { errorMessage: "Invalid email or password" })
        }
        

        const accessToken = generateAccessToken(user._id)
        const refreshToken = generateRefreshToken(user._id)

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 10 * 60 * 1000
        })

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 30 * 24 * 60 * 60 * 1000
        })

        return res.redirect('/user/home')

    } catch (error) {
        console.log(error);

    }

}

const resendOtp = async (req, res) => {
    try {
        const userId = req.userId
        const user = await tempUser.findById(userId)



        // if(!user){
        //    return res.render("otp", {errorMessage:"No user found"})
        // }

        const currentTime = Date.now();
        const lastOtpTime = currentTime - user.lastOtp;

        if (lastOtpTime < 60 * 1000) {
            const timeLeft = Math.ceil((60 * 1000 - lastOtpTime) / 1000);
            return res.render("otp", { errorMessage: `Please wait ${timeLeft} seconds before requesting a new OTP.` });
        }

        const { otp, otpExpiresAt } = generateOtp();
        user.otp = otp;
        user.otpExpiresAt = otpExpiresAt
        user.lastOtp = currentTime

        await user.save();


        await sendOtpEmail(user.email, otp)
        return res.render("otp", { errorMessage: "OTP has been resent" });

    } catch (error) {
        console.log(error);

    }
}

const renderForgotPasssword = async (req, res) => {
    try {
        res.render('forgotPassword')
    } catch (error) {
        console.log(error);

    }
}
const verifyUser = async (req, res) => {
    try {
        const { email } = req.body

        const user = await User.findOne({ email })

        if (user) {
            const { otp, otpExpiresAt } = generateOtp()

            const temp = new resetUser({
                email,
                otp,
                otpExpiresAt

            })

            await temp.save()

            const userId = temp._id


            const token = jwt.sign({ userId }, process.env.JWT_OTP_TOKEN, { expiresIn: '10m' })

            res.cookie('token', token, {
                httpOnly: false,
                maxAge: 10 * 60 * 1000
            })

            return res.redirect("/auth/login/forgotpassword/otp")
        } else {
            return res.render('forgotPassword', { errorMessage: "Invalid user" })
        }



    } catch (error) {
        console.log(error);

    }
}

const renderForgotPasswordOtp = async (req, res) => {
    try {
        return res.render("forgotPasswordOtp")
    } catch (error) {
        console.log(error);

    }
}

const verifyForgotPassswordOtp = async (req, res) => {
    try {

        const { otp } = req.body
        const userId = req.userId

        const tempUser1 = await resetUser.findById(userId)


        if (!tempUser1.otp) {
            return res.render('renderForgotPasswordOtp', { errorMessage: "No OTP found" })
        }

        if (otp === tempUser1.otp) {
            if (Date.now() > tempUser1.otpExpiresAt) {
                return res.render('renderForgotPasswordOtp', { errorMessage: "OTP Expired" })

            }

            return res.redirect('/auth/login/resetpassword')


        }
        else {
            return res.render('forgotPasswordOtp', { errorMessage: "Invalid OTP " })

        }
    } catch (error) {
        console.log(error);

    }
}

const renderResetPassword = async (req, res) => {
    try {
        res.render('resetpassword')
    } catch (error) {
        console.log(error);

    }
}

const resetPassword = async (req, res) => {
    try {
        const newpass = req.body.newpassword
        const spass = await bcrypt.hash(newpass, 10)
        const userId = req.userId



        const { email } = await resetUser.findById(userId)



        const passupdate = await User.findOneAndUpdate({ email }, { $set: { password: spass } })

        await passupdate.save()

        return res.send("pass updated")

    } catch (error) {
        console.log(error);

    }
}

const forgotPasswordResendOtp = async (req, res) => {
    try {
        const userId = req.userId
        const user = await resetUser.findById(userId)

        // if(!user){
        //    return res.render("forgotPasswordOtp", {errorMessage:"No user found"})
        // }


        const currentTime = Date.now();
        const lastOtpTime = currentTime - user.lastOtp;

        if (lastOtpTime < 60 * 1000) {
            const timeLeft = Math.ceil((60 * 1000 - lastOtpTime) / 1000);
            return res.render("forgotPasswordOtp", { errorMessage: `Please wait ${timeLeft} seconds before requesting a new OTP.` });
        }

        const { otp, otpExpiresAt } = generateOtp();
        user.otp = otp;
        user.otpExpiresAt = otpExpiresAt
        user.lastOtp = currentTime

        await user.save();

        await sendOtpEmail(user.email, otp)
        return res.render("forgotPasswordOtp", { errorMessage: "OTP has been resent" });

    } catch (error) {
        console.log(error);

    }
}

const googleSignin = async (req, res)=>{
    try {
        
        const userId=req.user._id
        
        const accessToken= generateAccessToken(userId)
        const refreshToken= generateRefreshToken(userId)

        res.cookie('accessToken', accessToken, {
            httpOnly:true,
            ssecure: process.env.NODE_ENV === 'production',
            maxAge: 10 * 60 * 1000
        })
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 30 * 24 * 60 * 60 * 1000
        });
        return res.redirect('/user/home')
    } catch (error) {
        console.log(error);
        
    }
}

module.exports = {
    renderLogin,
    renderSignUp,
    renderAdminLogin,
    renderOtpPage,
    signup,
    // getOtp,
    verifyOtp,
    userLogin,
    adminlogin,
    resendOtp,
    renderForgotPasssword,
    verifyUser,
    renderForgotPasswordOtp,
    verifyForgotPassswordOtp,
    renderResetPassword,
    resetPassword,
    forgotPasswordResendOtp,
    googleSignin

}