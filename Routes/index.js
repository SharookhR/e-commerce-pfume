const express = require('express')
const user = require('./userRoute')
const auth = require('./authRoute')
const admin = require('./adminRoute')
const {verifyRefreshTokenAdmin} = require('../middleware/admintoken')
const {verifyRefreshToken} =  require('../middleware/usertoken')
const router = express.Router()


router.use('/auth', auth)
router.use('/user', verifyRefreshToken, user)
router.use('/admin', verifyRefreshTokenAdmin, admin)


module.exports=router