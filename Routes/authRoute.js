const express = require('express')
const router = express.Router()
const {verifyToken} = require('../middleware/verifyotp_token')
const {renderLogin, renderSignUp, renderAdminLogin, renderOtpPage, signup, getOtp, verifyOtp, userLogin}= require('../Controller/authController')

router.route('/login').get(renderLogin).post(userLogin)
router.route('/signup').get(renderSignUp).post(signup)
router.route('/signup/otp').get(verifyToken,renderOtpPage).post(verifyToken, getOtp)
router.route('/signup/otp/verify').post(verifyToken,verifyOtp)

module.exports=router;