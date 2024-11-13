const jwt = require('jsonwebtoken')
const User = require("../Model/UserModel");
const bcrypt = require('bcrypt')
const Product = require('../Model/productModel');
const Address = require('../Model/addressModel');
const Cart = require('../Model/cartModel');
const Order = require('../Model/orderModel');
const Category = require('../Model/categoryModel')
const Brand = require('../Model/brandModel')
const Wishlist = require('../Model/wishlistModel')
const Razorpay = require('razorpay')
const crypto = require('crypto')
const Coupon = require('../Model/couponModel')
require('dotenv').config()

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
})

const createOrder = async (req, res) => {
  try {
    const options = {
      amount: 5000, 
      currency: "INR",
      receipt: "receipt#1",
    };
    const order = await instance.orders.create(options);
    res.status(200).json({ orderId: order.id, amount: order.amount }); 
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({ message: 'Failed to create order' });
  }
};

const renderHome = async (req, res) => {
  try {
    const userId = req.userId
    const cart = await Cart.findOne({userId})  
    const cartItemNo = cart? cart.items.length: 0
    const products = await Product.find().sort({createdAt:-1}).limit(3)
    console.log(products);
    

    return res.render("home", {cartItemNo, products});
  } catch (error) {
    console.log(error.message);
  }
};

const renderShop = async (req, res) => {
  try {
    const userId = req.userId;
    const cart = await Cart.findOne({ userId });
    const cartItemNo = cart ? cart.items.length : 0;

    const page = parseInt(req.query.page) || 1;
    const sort = req.query.sort || 'latest';
    const categoryId = req.query.category;
    const brandId = req.query.brand;
    const searchQuery = req.query.search || "";
    const outOfStock = req.query.outOfStock === 'true'; 
    const limit = 6;
    const skip = (page - 1) * limit;

    const filter = {};
    if (categoryId) {
      filter.category = categoryId;
    }
    if (brandId) {
      filter.brandName = brandId;
    }
    if (searchQuery) {
      filter.title = { $regex: searchQuery, $options: 'i' };
    }
    if (!outOfStock) {
      filter.stock = { $gt: 0 }; 
    }

    const totalProductCount = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalProductCount / limit);

    let sortCriteria = {};
    switch (sort) {
      case 'priceLowHigh':
        sortCriteria.price = 1;
        break;
      case 'priceHighLow':
        sortCriteria.price = -1;
        break;
      case 'a-z':
        sortCriteria.title = 1;
        break;
      case 'z-a':
        sortCriteria.title = -1;
        break;
      case 'latest':
      default:
        sortCriteria.createdAt = -1;
        break;
    }

    const products = await Product.find(filter)
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit);

    const noProducts = products.length === 0;
    
    const categories = await Category.find();
    const brands = await Brand.find();

    res.render('shop', {
      products,
      categories,
      brands,
      currentPage: page,
      totalPages,
      sort,
      categoryId,
      brandId,
      searchQuery,
      cartItemNo,
      noProducts,
      outOfStock 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};









const renderProductDetails = async(req, res)=>{
  try {
    const userId = req.userId
    const cart = await Cart.findOne({userId})  
    const cartItemNo = cart? cart.items.length: 0
    const productId= req.params.id
    const productDetail = await Product.findById(productId).populate('brandName', 'brandName').populate('category','title')

   return res.render('product-details', {productDetail, cartItemNo})
  } catch (error) {
    console.log(error);
    
  }
}
const renderMyAccount =  async (req, res)=>{
  try {
    const userId=req.userId
    const user = await User.findById(userId)
    const orders= await Order.find({userId})
    const cart = await Cart.findOne({userId})  
    const cartItemNo = cart? cart.items.length: 0
    return res.render('myAccount', {user, orders, cartItemNo})
  } catch (error) {
    console.log(error);
    
  }
}
const updateUserDetails = async (req, res) => {
  try {
    
    const { name, email } = req.body;
    
      const userId = req.userId
      
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { name, email },
        { new: true }  
    );

    if (updatedUser) {
        return res.json({ success: true, message: "Profile updated successfully", user: updatedUser });
    } else {
        return res.json({ success: false, message: "User not found" });
    }
    
    
    
} catch (error) {
    console.error("Error updating profile:", error);
    return res.json({ success: false, message: "An error occurred while updating the profile" });
}
};

const updateUserPassword = async (req, res) => {
  try {
    
    const { currentPassword, newPassword } = req.body;
    const userId = req.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Current password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword; 
    await user.save();
    return res.status(200).json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    return res.status(500).json({ success: false, message: "An error occurred while changing the password" });
  }
};

const renderOrderDetail = async(req, res)=>{
  try {
    const userId = req.userId
    const cart = await Cart.findOne({userId})  
    const cartItemNo = cart? cart.items.length: 0
    const orderId = req.params.id
    const order = await Order.findById(orderId).populate('items.product')
    const details = order.billingDetails
  
    
    res.render("userorderdetail",{order, details, cartItemNo})

  } catch (error) {
    console.log(error);
    
  }
}

const renderAddress = async(req, res)=> {
  try {
    const userId = req.userId
    const cart = await Cart.findOne({userId})  
    const cartItemNo = cart? cart.items.length: 0
    
    const address = await Address.findOne({userId})
   
    
    res.render('address', {address, cartItemNo})
  } catch (error) {
    console.log(error);
    
  }
}

const addAddress = async (req, res) => {
  try {
    const { userId } = req; 
    const { name, address, pincode, state, city, country, phone } = req.body;

   
    let userAddress = await Address.findOne({ userId });

    if (!userAddress) {

      userAddress = new Address({
        userId,
        addressDetails: [{ name, address, pincode, state, city, country, phone }]
      });
    } else {
     
      userAddress.addressDetails.push({ name, address, pincode, state, city, country, phone });
    }

   
    await userAddress.save();

    return res.json({ success: true, message: 'Address added successfully', address: userAddress });
  } catch (error) {
    console.error('Error adding address:', error);
    return res.status(500).json({ success: false, message: 'Failed to add address' });
  }
};


const editAddress = async (req, res) => {
    const addressId = req.params.id; 
    const { name, address, city, state, pincode, country, phone } = req.body;

    try {
    
        const addressDoc = await Address.findOneAndUpdate(
            { "addressDetails._id": addressId },
            {
                $set: {
                    "addressDetails.$.name": name,
                    "addressDetails.$.address": address,
                    "addressDetails.$.city": city,
                    "addressDetails.$.state": state,
                    "addressDetails.$.pincode": pincode,
                    "addressDetails.$.country": country,
                    "addressDetails.$.phone": phone
                }
            },
            { new: true }
        );

        if (!addressDoc) {
            return res.status(404).json({ success: false, message: "Address not found." });
        }

        return res.json({ success: true, message: "Address updated successfully." });
    } catch (error) {
        console.error("Error updating address:", error);
        return res.status(500).json({ success: false, message: "An error occurred while updating the address." });
    }
};

const deleteAddress = async (req, res) => {
  const addressId = req.params.id; 
  
  
  try {
     
      const addressDoc = await Address.findOneAndUpdate(
          { "addressDetails._id": addressId },
          { $pull: { addressDetails: { _id: addressId } } },
          { new: true }
      );

      if (!addressDoc) {
          return res.status(404).json({ success: false, message: "Address not found." });
      }

      return res.json({ success: true, message: "Address deleted successfully." });
  } catch (error) {
      console.error("Error deleting address:", error);
      return res.status(500).json({ success: false, message: "An error occurred while deleting the address." });
  }
};

const renderWishlist = async(req, res)=>{
  try {
    const userId = req.userId
    const cart = await Cart.findOne({userId}).populate('items.product')
    const cartItemNo = cart? cart.items.length: 0
    const wishlist = await Wishlist.findOne({userId}).populate('items.product')
    const wishlistItem = wishlist ? wishlist.items : []
    res.render("wishlist", {wishlistItem, cartItemNo})
  } catch (error) {
    console.log(error);
    
  }
}

const removeFromWishlist = async (req, res)=>{
  try {
    const userId = req.userId
    const productId = req.params.id
    
    const wishlist = await Wishlist.findOne({userId})
    if(!wishlist){
      return res.status(400).json({message: "Wishlist not found"})
    }
  
    const itemIndex = wishlist.items.findIndex(
      (item) => item.product.toString ()=== productId
    )
    
    

    if(itemIndex === -1){
      return res.status(404).json({message: 'Product not found in wishlist'})
    }
    
    wishlist.items.splice(itemIndex, 1);
    await wishlist.save();
    res.status(200).json({ message: "Product removed from wishlist successfully" });
  } catch (error) {
    console.log(error);
    
  }
}

const addToWishlist = async (req, res) => {
  try {
    const userId = req.userId;
    const productId = req.params.id;

   
    let wishlist = await Wishlist.findOne({ userId });

    if (wishlist) {
     
      const productExists = wishlist.items.some(item => item.product.toString() === productId);

      if (productExists) {
        return res.status(200).json({ success: false, message: 'This product is already in your wishlist.' });
      }

    
      wishlist.items.push({ product: productId });
    } else {
      wishlist = new Wishlist({
        userId,
        items: [{ product: productId }]
      });
    }

    await wishlist.save();
    return res.status(200).json({ success: true, message: 'Added to wishlist' });
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    return res.status(500).json({ success: false, message: 'An error occurred while adding to the wishlist' });
  }
};



const renderCart = async (req, res)=>{
  try {
    const userId = req.userId
    const cart = await Cart.findOne({userId}).populate('items.product')
    const cartItem = cart ? cart.items : []
    const cartItemNo = cart? cart.items.length: 0

    
    res.render('cart', {cartItem, cart, cartItemNo})
  } catch (error) {
    console.log(error);
    
  }
}


const addToCart = async (req, res) => {
  try {
      const userId = req.userId;
      const productId = req.params.id;
      const product = await Product.findById(productId);
      
      if (!product) {
          return res.status(404).json({ success: false, message: 'Product not found' });
      }

      let cart = await Cart.findOne({ userId });

      if (cart) {
          const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

          if (itemIndex > -1) {
              const currentQuantity = cart.items[itemIndex].quantity;
              if (currentQuantity >= product.stock) {
                  return res.status(400).json({ success: false, message: 'You already have the maximum available stock of this product in your cart' });
              }
              
              cart.items[itemIndex].quantity += 1;
          } else {
              cart.items.push({
                  product: productId,
                  price: product.price,
                  quantity: 1
              });
          }
      } else {
          cart = new Cart({
              userId,
              items: [{
                  product: productId,
                  price: product.price,
                  quantity: 1
              }],
          });
      }

      cart.totalPrice = cart.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );

      await cart.save();
      return res.json({success:true, message: 'Added to cart successfully' });
  } catch (error) {
      console.error("Error adding to cart:", error);
      return res.status(500).json({ success: false, message: 'An error occurred while adding to the cart' });
  }
};



const updateQuantity = async (req, res) => {
  try {
    const userId = req.userId;
    const productId = req.params.productId;
    const action = req.params.action; 
  
    
    let userCart = await Cart.findOne({ userId: userId }).populate("items.product");
   
    if (userCart) {
      const productInCart = userCart.items.find(
        (item) => item.product._id.toString() === productId
      );
  

      if (productInCart) {
        const product = await Product.findById(productId);
        if (!product) {
          return res.status(404).json({ success: false, message: "Product not found" });
        }

        const maxQuantity = product.stock;
        const priceToUse = product.isDiscounted ? product.offerPrice : product.price;
      

        if (action === "increment") {
          if (productInCart.quantity < maxQuantity) {
            productInCart.quantity += 1; 
            productInCart.price = priceToUse; 
            
            userCart.totalPrice = userCart.items.reduce(
              (total, item) => total + item.price * item.quantity,
              0
            );

            await userCart.save(); 

            return res.json({
              success: true,
              quantity: productInCart.quantity,
              price: productInCart.price,
              totalPrice: userCart.totalPrice,
            });
          } else {
            return res.json({
              success: false,
              message: "Maximum quantity reached for this product",
            });
          }
        } else if (action === "decrement") {
          if (productInCart.quantity > 1) {
            productInCart.quantity -= 1; 
            productInCart.price = priceToUse; 

            userCart.totalPrice = userCart.items.reduce(
              (total, item) => total + item.price * item.quantity,
              0
            );

            await userCart.save(); 
            return res.json({
              success: true,
              quantity: productInCart.quantity,
              price: productInCart.price,
              totalPrice: userCart.totalPrice,
            });
          } else {
            return res.json({
              success: false,
              message: "Quantity cannot be less than 1.",
            });
          }
        } else {
          return res.json({
            success: false,
            message: "Invalid action provided",
          });
        }
      } else {
        return res.json({
          success: false,
          message: "Product not found in the cart",
        });
      }
    } else {
      return res.json({ success: false, message: "User cart not found" });
    }
  } catch (error) {
    console.error("Error updating quantity:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};



const removeFromCart = async (req, res) => {
  const userId = req.userId;
  const productId = req.params.id;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );
    
    
    if (itemIndex === -1) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    cart.items.splice(itemIndex, 1);

    cart.totalPrice = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    await cart.save();

    res.status(200).json({ message: "Product removed from cart successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error removing product from cart" });
  }

};

const renderCheckout = async (req, res)=>{
  try {
    const userId = req.userId 
    
    const address = await Address.find({userId})
    const cart = await Cart.findOne({userId}).populate('items.product')
    const user = await User.findById(userId)
    const cartItemNo = cart? cart.items.length: 0

    if(!cart){
      return res.status(500).json({message: "Cart not found"})
    }

    userCart = cart.items;
    totalPrice = cart.totalPrice;
    discount = cart.discount;

  
    
    
    
    res.render('checkout', {
      address,
      cartItems : userCart,
      totalPrice:totalPrice,
      user,
      cart,
      discount,
      cartItemNo
    })
  } catch (error) {
    console.log(error);
    
  }

}


const listCoupon = async (req, res) => {
  try {
      const coupons = await Coupon.find({}); // Fetch all available coupons
      res.json({ success: true, coupons });
  } catch (error) {
      res.json({ success: false, message: "Unable to fetch coupons" });
  }
};

const applyCoupon = async(req, res)=>{
  
    const { couponCode } = req.body;
    
    try {
        const userId = req.userId
        const coupon = await Coupon.findOne({ couponCode });
        
        if (!coupon) {
            return res.json({ success: false, message: "Invalid coupon code" });
        }
        console.log('here');
        
        const totalPrice = await Cart.findOne({userId})
        console.log(totalPrice);
        
        if(totalPrice<coupon.minPurchaseAmount){
          return res.json({success:false, message:`Minimum Purchase amount : ${coupon.minPurchaseAmount}`})
        }

        const now = new Date();
        if (coupon.expiryDate < now || coupon.usageLimit <= 0) {
            return res.json({ success: false, message: "Coupon has expired or reached its usage limit" });
        }
        const cart = await Cart.findOne({userId: req.userId})
        const total = cart.totalPrice;
        const discount = (coupon.discount / 100) * total;
        const newTotal = total - discount;
  
        
        await Coupon.updateOne({ code: couponCode }, { $inc: { usageLimit: -1 } });

        res.json({ success: true, discount, newTotal });
    } catch (error) {
        res.status(500).json({ success: false, message: "An error occurred" });
    }
}



const placeOrder = async (req, res) => {
  try {
    const { addressId, paymentMethod, notes, couponCode  } = req.body;
    const userId = req.userId;
    const cart = await Cart.findOne({ userId }).populate("items.product");
    const totalPrice = cart.totalPrice
    console.log(couponCode);
    
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty." });
    }
      let discount = 0;
      if (couponCode) {
        const coupon = await Coupon.findOne({ couponCode, isListed: true });
        if (coupon) {
            discount = (totalPrice * coupon.discount) / 100;
        }
    }
    
    const totalAmount = totalPrice - discount
   
    const orderNo = await Order.getNextOrderNumber();
    

    const address = await Address.findOne({ "addressDetails._id": addressId });
    
    const billingDetails = address.addressDetails.find(
      (address) => address._id.toString() === addressId
    );

    if (!billingDetails) {
      return res.status(400).json({ success: false, message: "Invalid address selected." });
    }

    
    if (paymentMethod === "Razorpay") {
      
      const razorpayOrder = await instance.orders.create({
        amount: totalAmount * 100, 
        currency: "INR",
        receipt: `order_rcptid_${orderNo}`

      });

      if (!razorpayOrder) {
        return res.status(500).json({ success: false, message: "Failed to create Razorpay order" });
      }

  
      
      return res.json({
        success: true,
        razorpayOrderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
      });
    }

    const order = new Order({
      userId,
      items: cart.items.map(item => ({
        product: item.product._id,
        price: item.product.price,
        quantity: item.quantity
      })),
      totalPrice:totalAmount,
      discount,
      status: "Pending",
      billingDetails,
      paymentMethod,
      orderDate: new Date(),
      paymentStatus: paymentMethod === "COD" ? "Pending" : "Paid", 
      returnReason: "",
      notes: notes,
      orderno: orderNo
    });

    await order.save();

    
    for (let item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock: -item.quantity }
      });
    }

   
    await Cart.deleteOne({ userId });

    res.json({ success: true, message: "Order placed successfully", orderId: order._id });

  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ success: false, message: "Failed to place order" });
  }
};


const verifyPayment = async (req, res) => {
  try {
    const { paymentId, orderId, signature, addressId, notes, couponCode } = req.body;
    
    const userId = req.userId;
    const cart = await Cart.findOne({ userId });
    const totalPrice = cart.totalPrice;
    const orderNo = await Order.getNextOrderNumber();
    
    let discount = 0;
    if (couponCode) {
      const coupon = await Coupon.findOne({ couponCode, isListed: true });
      if (coupon) {
          discount = (totalPrice * coupon.discount) / 100;
      }
  }
  
  
  const totalAmount = totalPrice - discount
  console.log(discount, couponCode, totalAmount);
    const address = await Address.findOne({ 'addressDetails._id': addressId });
    const billingDetails = address.addressDetails.find(
      (address) => address._id.toString() === addressId
    );

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${orderId}|${paymentId}`)
      .digest("hex");

    if (generatedSignature === signature) {
      const order = new Order({
        userId,
        items: cart.items.map(item => ({
          product: item.product._id,
          price: item.product.price,
          quantity: item.quantity
        })),
        totalPrice:totalAmount,
      discount,
        status: "Pending",
        billingDetails,
        paymentMethod: "Razorpay", 
        orderDate: new Date(),
        paymentStatus: "Paid", 
        returnReason: "",
        notes,
        orderno: orderNo
      });
      
      await order.save();

    
      for (let item of cart.items) {
        await Product.findByIdAndUpdate(item.product._id, {
          $inc: { stock: -item.quantity }
        });
      }

     
      await Cart.deleteOne({ userId });
      
      res.json({ success: true, message: "Payment verified and order placed successfully", orderId: order._id });
    } else {
      res.status(400).json({ success: false, message: "Payment verification failed" });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ success: false, message: "Payment verification failed" });
  }
};








const renderOrderSuccess = async (req, res)=>{
  try {
    const userId = req.userId
    const cart = await Cart.findOne({userId})
    const cartItemNo = cart? cart.items.length: 0
    const orderId = req.params.id
    const order =await Order.findById(orderId)
    
    
    res.render('orderSuccess', {order, cartItemNo})
  } catch (error) {
    console.log(error);
    
  }
}

const cancelOrder = async (req, res) => {
  try {
      const orderId = req.params.id;

      // Find the order by ID and populate the product details in items
      const order = await Order.findById(orderId).populate('items.product');
      if (!order) {
          return res.status(404).send('Order not found');
      }

      // Update the status of the order to 'Cancelled'
      order.status = 'Cancelled';

      // Loop through each item to adjust the stock for each product
      for (const item of order.items) {
          const product = item.product;
          if (product && item.productStatus !== 'Cancelled') {
              item.productStatus="Cancelled"
              product.stock += item.quantity;
              await product.save();
          }
      }

      // Save the updated order status
      await order.save();

      return res.status(200).json({ success: true, message: 'Order has been canceled successfully, and stock has been updated.' });
  } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
  }
};




const cancelProduct = async (req, res) => {
  try {
      const { orderId, itemId } = req.params;

      // Find the order by ID
      const order = await Order.findById(orderId).populate('items.product');
      if (!order) {
          return res.status(404).json({ success: false, message: 'Order not found' });
      }

      // Find the item to cancel
      const item = order.items.id(itemId);
      if (item) {
          // Update product status to 'Cancelled'
          item.productStatus = 'Cancelled';

          // Update the stock for the canceled item
          const product = item.product;
          if (product) {
              product.stock += item.quantity;
              await product.save();
          }

          // Save the updated order
          await order.save();

          // Check if all items are canceled
          const allItemsCancelled = order.items.every(item => item.productStatus === 'Cancelled');
          if (allItemsCancelled) {
              order.status = 'Cancelled';
              await order.save();
          }

          return res.json({ success: true, message: 'Product canceled successfully and stock updated.' });
      } else {
          return res.status(404).json({ success: false, message: 'Product not found in the order' });
      }
  } catch (error) {
      console.error('Error cancelling product:', error);
      res.status(500).json({ success: false, message: 'An error occurred while cancelling the product' });
  }
};





const logout = async (req, res) => {
  try {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    return res.redirect("/auth/login");
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  renderHome,
  renderShop,
  renderProductDetails,
  renderMyAccount,
  updateUserDetails,
  updateUserPassword,
  renderOrderDetail,
  renderAddress,
  addAddress,
  editAddress,
  deleteAddress,
  renderWishlist,
  addToWishlist,
  removeFromWishlist,
  renderCart,
  addToCart,
  updateQuantity,
  removeFromCart,
  renderCheckout,
  listCoupon,
  applyCoupon,
  placeOrder,
  verifyPayment,
  renderOrderSuccess,
  cancelOrder,
  cancelProduct,
  createOrder,
  logout,
};
