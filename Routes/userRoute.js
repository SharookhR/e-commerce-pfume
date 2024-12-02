const express = require('express')
const userController = require('../Controller/userController')

const {userErrorPage} = require('../middleware/404')
const router = express.Router()


router.route('/home').get(userController.renderHome)
router.route('/shop').get(userController.renderShop)
router.route('/product-details/:id').get(userController.renderProductDetails)

//Account
router.route('/myaccount').get(userController.renderMyAccount)
router.route('/updatedetails').post(userController.updateUserDetails)
router.route('/updatepassword').post(userController.updateUserPassword)
router.route('/orderdetail/:id').get(userController.renderOrderDetail)
router.route('/orderdetail/:id/invoice').get(userController.generateOrderInvoice)
router.route('/cancelorder/:id').delete(userController.cancelOrder)
router.route('/cancelproduct/:orderId/:itemId').patch(userController.cancelProduct);
router.route('/returnorder/:id').post(userController.returnOrder)
router.route('/returnorderitem/:orderId/:itemId').patch(userController.returnOrderItem);


router.route('/orderdetail/:id/retrypayment').post(userController.retryPayment)
router.route('/orderdetail/:id/verifyretrypayment').post(userController.verifyRetryPayment)



//Address
router.route('/manageaddress').get(userController.renderAddress)
router.route('/addaddress').post(userController.addAddress)
router.route('/editaddress/:id').put(userController.editAddress)
router.route('/deleteaddress/:id').delete(userController.deleteAddress)

//cart
router.route('/cart').get(userController.renderCart)
router.route('/addtocart/:id').post(userController.addToCart)
router.route('/cart/updatequantity/:productId/:action').post(userController.updateQuantity)
router.route('/cart/removefromcart/:id').delete(userController.removeFromCart)
router.route('/checkstock').get(userController.checkStock)

//Wish list
router.route('/wishlist').get(userController.renderWishlist)
router.route('/addtowishlist/:id').post(userController.addToWishlist)
router.route('/removefromwishlist/:id').delete(userController.removeFromWishlist)


//Checkout
router.route('/checkout').get(userController.renderCheckout).post(userController.placeOrder)
router.route('/checkout/verifyPayment').post(userController.verifyPayment)
router.route('/checkout/listcoupon').get(userController.listCoupon)
router.route('/checkout/applycoupon').post(userController.applyCoupon)


router.route('/ordersuccess/:id').get(userController.renderOrderSuccess)

//Logout
router.route('/logout').get(userController.logout)

//Error Page
router.use(userErrorPage)


module.exports=router