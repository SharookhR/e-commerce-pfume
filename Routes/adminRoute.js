const express = require('express')
const adminController = require('../Controller/adminController')
const {verifyRefreshToken} = require('../middleware/admin_token')
const router = express.Router()
router.route('/dashboard').get(verifyRefreshToken, adminController.dashboard)
router.route("/products").get(verifyRefreshToken, adminController.products)
router.route("/orders").get(verifyRefreshToken, adminController.orders)
router.route('/brands').get(verifyRefreshToken, adminController.brands)
module.exports=router