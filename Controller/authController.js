const User = require('../Model/UserModel')
const tempUser = require('../Model/tempUser')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { generateAccessToken, generateRefreshToken } = require('../utility/token')
const { generateOtp, sendOtpEmail } = require('../utility/otputility')
const resetUser = require("../Model/otpModel")

const renderLogin = async (req, res) => {
    try {

        return res.render('login', { errorMessage: req.flash('error-message') });
    } catch (error) {
        console.log(error);

    }

};




const renderSignUp = async (req, res) => {

    try {
        return res.render('signup', { errorMessage: req.flash('error-message') })
    } catch (error) {
        console.log(error);

    }
}

const renderAdminLogin = async (req, res) => {



    try {
        res.render('adminlogin', { errorMessage: req.flash("error-message") });

    } catch (error) {

        console.log(error);
    }

}


const adminlogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            req.flash('error-message', "Invalid email or password")
            return res.redirect('/auth/adminlogin');
        }

        if (!user.isAdmin) {
            req.flash('error-message', "You are not an admin")
            return res.redirect('/auth/adminlogin')
        }

        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 10 * 6 * 1000
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 30 * 24 * 60 * 60 * 1000
        });

        return res.redirect('/admin/dashboard');
    } catch (error) {
        console.log(error);

    }
};


const renderOtpPage = async (req, res) => {


    try {
        const token = req.cookies.token;
        

        if (!token) {
            return res.redirect('/auth/signup')
        }
        const decode = jwt.verify(token, process.env.JWT_OTP_TOKEN)
        const checkingUser = decode.userId
        const user = await tempUser.findById(checkingUser)
        



        return res.render('otp', { errorMessage: req.flash('error-message'), expiresAt:user.lastOtp.getTime()})
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
            req.flash('error-message', 'User already exist')
            return res.redirect('/auth/signup')

        }

        const spass = await bcrypt.hash(password, 10)
        const user = new tempUser({
            name,
            email,
            phone: mno,
            password: spass


        })
        await user.save()

        const { otp, otpExpiresAt, lastOtp } = generateOtp();
        user.otp = otp;
        user.otpExpiresAt = otpExpiresAt;
        user.lastOtp=lastOtp;
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
                req.flash("error-message", 'OTP expired')
                return res.redirect('/auth/signup/otp')

            }
            const user = new User({
                name: tempUserData.name,
                email: tempUserData.email,
                password: tempUserData.password,
                phone: tempUserData.phone,

            })

            await user.save()
            req.flash('error-message', "Registered successfully")
            return res.redirect('/auth/login')

        }
        else {
            req.flash('error-message', 'Invalid OTP')
            return res.redirect('/auth/signup/otp')

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
            req.flash('error-message', "Invalid Email or password")
            return res.redirect('/auth/login')
        }


        const accessToken = generateAccessToken(user._id)
        const refreshToken = generateRefreshToken(user._id)

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 10* 6*1000
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
        const currentTime = Date.now()
        const lastOtpTime =  currentTime - user.lastOtp
        if(lastOtpTime<60*1000){
            req.flash("error-message", "Please wait ")
            return res.redirect('/auth/signup/otp')
        }
        const { otp, otpExpiresAt, lastOtp} = generateOtp();
        user.otp = otp;
        user.otpExpiresAt = otpExpiresAt
        user.lastOtp = lastOtp
        

        await user.save();


        await sendOtpEmail(user.email, otp)
        req.flash('error-message', 'OTP has been resent')
        return res.redirect("/auth/signup/otp");

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
            await sendOtpEmail(email,otp)

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
        const token = req.cookies.token;
    
        const decode = jwt.verify(token, process.env.JWT_OTP_TOKEN)
        const checkingUser = decode.userId
        const user = await resetUser.findById(checkingUser)
        
        const expiresAt = user.otpExpiresAt.getTime()
        
        return res.render("forgotPasswordOtp", {errorMessage:req.flash('error-message'), expiresAt})
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
            req.flash('error-message', 'No OTP found')
            return res.redirect('/auth/login/forgotpassword/otp')
        }

        if (otp === tempUser1.otp) {
            if (Date.now() > tempUser1.otpExpiresAt) {
                req.flash('error-message', 'OTP Expired')
            return res.redirect('/auth/login/forgotpassword/otp')

            }

            return res.redirect('/auth/login/resetpassword')


        }
        else {
            req.flash('error-message', 'Invalid OTP')
            return res.redirect('/auth/login/forgotpassword/otp')

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
        res.clearCookie('token')
        req.flash('error-message','Password updated')
        return res.redirect("/auth/login")

    } catch (error) {
        console.log(error);

    }
}

const forgotPasswordResendOtp = async (req, res) => {
    try {
        const userId = req.userId
        const user = await resetUser.findById(userId)

        const currentTime = Date.now();
        const lastOtpTime = currentTime - user.lastOtp;

        if(lastOtpTime<60*1000){
            req.flash("error-message", "Please wait ")
            return res.redirect('/auth/login/forgotpassword/otp')
        }

        const { otp, otpExpiresAt } = generateOtp();
        user.otp = otp;
        user.otpExpiresAt = otpExpiresAt
        user.lastOtp = currentTime

        await user.save();

        await sendOtpEmail(user.email, otp)
        req.flash('error-message', 'OTP has been resent')
        return res.redirect("/auth/login/forgotpassword/otp");
        

    } catch (error) {
        console.log(error);

    }
}

const googleSignin = async (req, res) => {
    try {

        const userId = req.user._id

        const accessToken = generateAccessToken(userId)
        const refreshToken = generateRefreshToken(userId)

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            ssecure: process.env.NODE_ENV === 'production',
            maxAge: 10* 6*1000
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