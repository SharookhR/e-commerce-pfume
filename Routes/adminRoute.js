const express = require('express')
const adminController = require('../Controller/adminController')

const router = express.Router()

//View Dashboard
router.route('/dashboard').get(adminController.renderDashboard)

//Products
router.route("/products").get(adminController.renderProducts)
router.route('/addproduct').get(adminController.renderAddProducts)
router.route('/editproduct').get(adminController.renderEditProducts)

//User
router.route("/users").get(adminController.renderUsers)
router.route('/blockuser/:id').post(adminController.blockUsers)
router.route('/unblockuser/:id').post(adminController.unblockUsers)

//Brands
router.route('/brands').get(adminController.renderBrands)
router.route('/addbrands').get(adminController.renderAddBrands)
router.route('/editbrands').get(adminController.renderEditBrands)

//Categories
router.route('/categories').get(adminController.renderCategories)
router.route('/addcategories').get(adminController.renderAddCategories)
router.route('/editcategories').get(adminController.renderEditCategories)

module.exports=router