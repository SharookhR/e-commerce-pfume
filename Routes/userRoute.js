const express = require('express')
const userController = require('../Controller/userController')
const {verifyRefreshToken} =  require('../middleware/user_token')
const router = express.Router()
router.route('/home').get(verifyRefreshToken,userController.home)

module.exports=router