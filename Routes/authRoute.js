const express = require('express')
const router = express.Router()
const {verifyToken} = require('../middleware/verifyotp_token')
const {verifyForgetToken} = require('../middleware/verifyforget_token')
const {renderLogin, renderSignUp, renderAdminLogin, renderOtpPage, signup, getOtp, verifyOtp, userLogin,home, adminlogin, resendOtp, renderForgotPasssword, verifyUser, renderForgotPasswordOtp, verifyForgotPassswordOtp, renderResetPassword, resetPassword, forgotPasswordResendOtp}= require('../Controller/authController')
const nocache = require('nocache')
const {checkLogin} = require('../middleware/preventUserLogin')
const passport = require('passport')

// router.use(express.static('public'))
router.use(nocache())
router.use(passport.initialize());
router.route('/login').get(checkLogin, renderLogin).post(userLogin)

router.route('/signup').get(checkLogin, renderSignUp).post(signup)
router.route('/signup/otp').get(verifyToken,renderOtpPage)
router.route('/signup/otp/verify').post(verifyToken,verifyOtp)
router.route('/signup/otp/resend').post(verifyToken, resendOtp);
router.route('/adminlogin').get(renderAdminLogin).post(adminlogin)
router.route('/login/forgotpassword').get(renderForgotPasssword).post(verifyUser)
router.route('/login/forgotpassword/otp').get(verifyForgetToken,renderForgotPasswordOtp)
router.route('/login/forgotpassword/otp/verify').post(verifyForgetToken,verifyForgotPassswordOtp)
router.route('/login/forgotpassword/otp/resend').post(verifyForgetToken, forgotPasswordResendOtp)
router.route('/login/resetpassword').get(verifyForgetToken,renderResetPassword).post(verifyForgetToken,resetPassword)

module.exports=router;