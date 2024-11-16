const express = require('express')
const adminController = require('../Controller/adminController')
const {adminErrorPage} = require('../middleware/404')
const router = express.Router()
const upload = require('../middleware/upload')


router.route('/dashboard').get(adminController.renderDashboard)

//Products
router.route("/products").get(adminController.renderProducts)
router.route('/addproduct').get(adminController.renderAddProducts).post(upload,adminController.addproduct)
router.route('/editproduct/:id').get(adminController.renderEditProducts).post(upload,adminController.editProduct)
router.route('/blockproduct/:id').get(adminController.blockProduct)
router.route('/unblockproduct/:id').get(adminController.unblockProduct)

//User
router.route("/users").get(adminController.renderUsers)
router.route('/blockuser/:id').get(adminController.blockUsers)
router.route('/unblockuser/:id').get(adminController.unblockUsers)

//Brands
router.route('/brands').get(adminController.renderBrands)
router.route('/addbrands').get(adminController.renderAddBrands).post(adminController.addBrands)
router.route('/editbrands/:id').get(adminController.renderEditBrands).put(adminController.editBrand)
router.route('/blockbrand/:id').get(adminController.blockBrand)
router.route('/unblockbrand/:id').get(adminController.unblockBrand)

//Categories
router.route('/categories').get(adminController.renderCategories)
router.route('/addcategories').get(adminController.renderAddCategories).post(adminController.addCategories)
router.route('/editcategories/:id').get(adminController.renderEditCategories).put(adminController.editcategories)
router.route('/blockcategory/:id').get(adminController.blockCategory)
router.route('/unblockcategory/:id').get(adminController.unblockCategory)


//Orders
router.route('/orders').get(adminController.renderOrder)
router.route('/orderdetail/:id').get(adminController.renderOrderDetail).put(adminController.changeStatus)
router.route('/cancelproduct/:orderId/:itemId').post(adminController.cancelProduct)


//Offer
router.route('/offers').get(adminController.renderOffer)
router.route('/addoffer').get(adminController.renderAddOffer).post(adminController.addOffer)
router.route('/listoffer/:id').patch(adminController.listOffer)
router.route('/unlistoffer/:id').patch(adminController.unlistOffer)

//Coupon
router.route('/coupons').get(adminController.renderCoupon)
router.route('/addcoupon').get(adminController.renderAddCoupon).post(adminController.addCoupon)
router.route('/coupons/deletecoupon/:id').delete(adminController.deleteCoupon)


//Sales Report
router.route('/salesreport').get(adminController.renderSalesReport)

router.route('/logout').get(adminController.logout)


router.use(adminErrorPage)
module.exports=router