const express = require('express')
const adminController = require('../Controller/adminController')

const router = express.Router()
const upload = require('../middleware/upload')

//View Dashboard
router.route('/dashboard').get(adminController.renderDashboard)

//Products
router.route("/products").get(adminController.renderProducts)
router.route('/addproduct').get(adminController.renderAddProducts).post(upload,adminController.addproduct)
router.route('/editproduct/:id').get(adminController.renderEditProducts).post(upload,adminController.editProduct)
router.route('/blockproduct/:id').post(adminController.blockProduct)
router.route('/unblockproduct/:id').post(adminController.unblockProduct)

//User
router.route("/users").get(adminController.renderUsers)
router.route('/blockuser/:id').post(adminController.blockUsers)
router.route('/unblockuser/:id').post(adminController.unblockUsers)

//Brands
router.route('/brands').get(adminController.renderBrands)
router.route('/addbrands').get(adminController.renderAddBrands).post(adminController.addBrands)
router.route('/editbrands/:id').get(adminController.renderEditBrands).post(adminController.editBrand)
router.route('/blockbrand/:id').post(adminController.blockBrand)
router.route('/unblockbrand/:id').post(adminController.unblockBrand)

//Categories
router.route('/categories').get(adminController.renderCategories)
router.route('/addcategories').get(adminController.renderAddCategories).post(adminController.addCategories)
router.route('/editcategories/:id').get(adminController.renderEditCategories).post(adminController.editcategories)
router.route('/blockcategory/:id').post(adminController.blockCategory)
router.route('/unblockcategory/:id').post(adminController.unblockCategory)

module.exports=router