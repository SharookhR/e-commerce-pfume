const express = require('express')
const session = require('express-session')
const authController = require('../Controller/authController')

const auth_route= express()
auth_route.use(session({
    secret:"monkey",
    resave:false,
    saveUninitialized:true
}))
auth_route.set("view engine",'ejs')
auth_route.set("views", "./Views/auth")
auth_route.use(express.static('public'))
auth_route.get('/login',authController.renderLogin)
auth_route.get('/signup', authController.renderSignUp)
auth_route.get('/adminlogin', authController.renderAdminLogin)
auth_route.get('/otp', authController.renderOtp)
auth_route.get('/home',(req, res)=>{
    res.render('home')
})

module.exports=auth_route;