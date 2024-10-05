const User = require('../Model/UserModel')
const tempUser = require('../Model/tempUser')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { json } = require('express')
const {generateAccessToken, generateRefreshToken} = require('../utility/token')
const { generateOtp, sendOtpEmail } = require('../utility/otputility')



const renderLogin = async (req,res)=>{
    try {
        const userId = req.userId;
        if(userId){
            return res.redirect('/auth/home')
        }
        res.render('login')
    } catch (error) {
        console.log(error);
        
    }
}

const renderSignUp = async (req,res)=>{
    
    try {
        res.render('signup')
        } catch (error) {
        console.log(error);
        
    }
}

const renderAdminLogin = async(req, res)=>{
    try {
        res.render('adminlogin')
    } catch (error) {
        console.log(error);
        
    }
}
const renderOtpPage = async(req, res)=>{

    const token = req.cookies.token;
    console.log(token);
    if(!token){
       return res.redirect('/auth/signup')
    }
    try {
        return res.render('otp')
    } catch (error) {
        console.error('Token verification failed:', error);
        return res.redirect('/auth/signup');
    }
    
}

const signup = async (req, res)=>{
    
   
    try {
        const {name, password, email, mno} = req.body
        const existence = await User.findOne({email})
        if(existence){
           return res.redirect("/auth/signup")

        }
        
        const spass = await bcrypt.hash(password, 10)
        const user = new tempUser({
            name,
            email,
            phone:mno,
            password:spass


        })
        await user.save()
        const userId = user._id
        const token = jwt.sign({userId}, process.env.JWT_OTP_TOKEN, {expiresIn:'15m'})

        res.cookie('token', token, {
            httpOnly:false,
            maxAge: 10 * 60 *1000
        })
        
        res.status(200).json({success:true, message: "User registered successfully", token})
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false, message: "Error registering user"})

        
    }
}

const getOtp = async (req, res)=>{
    try {
        const userId = req.user
        
        const user = await tempUser.findById(userId)

        if(!user){
            return res.status(400).json({success:false, message: "No user found with this ID"})
        }
        else{
            const {otp, otpExpiresAt} = generateOtp()

            user.otp = otp;
            user.otpExpiresAt = otpExpiresAt

            await user.save()

            await sendOtpEmail(user.email, otp)

            return res.status(200).json({success: true, message: "Otp has been send"})

        }
    } catch (error) {
     console.log(error);
     return res.status(500).json({success:false, message: "Server error occured"})
        
    }
}

const verifyOtp = async(req, res)=>{
    try {
        const userId = req.user
        const {otp} = req.body

        const tempUserData = await tempUser.findById(userId)

        if(!tempUserData.otp){
           return res.status(400).json({success:false, message: "No otp found for this email"})
        }

        if(otp===tempUserData.otp){
            if(Date.now()>tempUserData.otpExpiresAt){
               return res.status(500).json({success:false, message: "Server error occured"})

            }
            const user = new User({
                name:tempUserData.name,
                email:tempUserData.email,
                password:tempUserData.password,
                phone:tempUserData.phone,
                isAdmin:tempUserData.isAdmin
            })

            await user.save()
            return res.status(200).json({success:true, message: "OTP verified"})

        }
        else{
            return res.status(400).json({success:false, message: "Invalid OTP"})

        }
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false, message: "Server error occured"})
    }
}

const userLogin = async(req, res)=>{
    try {
        const {email, password} = req.body

        const user = await User.findOne({email})
        if(!user || !(await user.comparePassword(password))){
            return res.status(401).json({success:false, message: "Invalid email or password"})
        }

        const accessToken = generateAccessToken(user._id)
        const refreshToken = generateRefreshToken(user._id)

        res.cookie('accessToken', accessToken, {
            httpOnly:true,
            secure:process.env.NODE_ENV === 'production',
            maxAge:1 * 60 * 1000
        })

        res.cookie('refreshToken', refreshToken, {
            httpOnly:true,
            secure:process.env.NODE_ENV === 'production',
            maxAge:2 * 60 * 1000
        })

        return res.status(200).json({success:true, message: "Logged in successfully"})

    } catch (error) {
        return res.status(500).json({success:false, message: "Server error"})
    }

}


module.exports={
    renderLogin,
    renderSignUp,
    renderAdminLogin,
    renderOtpPage,
    signup,
    getOtp,
    verifyOtp,
    userLogin

}