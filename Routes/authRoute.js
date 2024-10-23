const express = require('express')
const router = express.Router()
const {verifyToken} = require('../middleware/verifyotp_token')
const {verifyForgetToken} = require('../middleware/verifyforget_token')
const {renderLogin, renderSignUp, renderAdminLogin, renderOtpPage, signup, verifyOtp, userLogin, adminlogin, resendOtp, renderForgotPasssword, verifyUser, renderForgotPasswordOtp, verifyForgotPassswordOtp, renderResetPassword, resetPassword, forgotPasswordResendOtp, googleSignin}= require('../Controller/authController')
const nocache = require('nocache')
const {preventUserLogin} = require('../middleware/preventUserLogin')
const {preventAdminLogin} = require('../middleware/preventadminlogin')
const passport = require('passport')


// router.use(express.static('public'))
router.use(nocache())
router.use(passport.initialize());
router.use(passport.session());
router.route('/login').get(preventUserLogin, renderLogin).post(userLogin)

router.route('/signup').get(preventUserLogin, renderSignUp).post(signup)
router.route('/signup/otp').get(verifyToken,renderOtpPage)
router.route('/signup/otp/verify').post(verifyToken,verifyOtp)
router.route('/signup/otp/resend').post(verifyToken, resendOtp);
router.route('/adminlogin').get(preventAdminLogin, renderAdminLogin).post(adminlogin)
router.route('/login/forgotpassword').get(renderForgotPasssword).post(verifyUser)
router.route('/login/forgotpassword/otp').get(verifyForgetToken,renderForgotPasswordOtp)
router.route('/login/forgotpassword/otp/verify').post(verifyForgetToken,verifyForgotPassswordOtp)
router.route('/login/forgotpassword/otp/resend').post(verifyForgetToken, forgotPasswordResendOtp)
router.route('/login/resetpassword').get(verifyForgetToken,renderResetPassword).post(verifyForgetToken,resetPassword)


router.route('/google').get(passport.authenticate('google', {
    scope: ['profile', 'email'],
    prompt:"select_account"
}))


router.route('/google/callback').get(preventUserLogin, passport.authenticate('google', {failureRedirect: '/login'}),googleSignin
)
module.exports=router;