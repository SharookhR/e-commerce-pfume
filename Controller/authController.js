const user = require('../Model/UserModel')

const renderLogin = async (req,res)=>{
    res.render('login')
}

const renderSignUp = async (req,res)=>{
    res.render('signup')
}

const renderAdminLogin = async(req, res)=>{
    res.render('adminlogin')
}
const renderOtp = async(req, res)=>{
    res.render('otp')
}
const signup = async(req, res)=>{
    
}
module.exports={
    renderLogin,
    renderSignUp,
    renderAdminLogin,
    renderOtp,
    signup
}