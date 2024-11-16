const { status } = require("express/lib/response");
const User = require("../Model/UserModel");
const Categories = require('../Model/categoryModel');
const Brand = require("../Model/brandModel");
const Product = require('../Model/productModel');
const Order = require("../Model/orderModel");
const Coupon = require('../Model/couponModel')
const Offer = require('../Model/offerModel')
const fs = require('fs')
const path = require('path')

const renderDashboard = async (req, res) => {
    try {
    
        res.render("dashboard");
    } catch (error) {
        
        console.log(error.message);
    }
};
const renderProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({createdAt:-1}).populate('brandName').populate('category','title')
      
        res.render("products",{products});
    } catch (error) {
        console.log(error.message);
    }
};
const renderUsers = async (req, res) => {

    try {
        const user = await User.find({ isAdmin: 0 }).sort({createdAt:-1});
        return res.render("users", { user });
    } catch (error) {
        console.log(error);
    }
};

const blockUsers = async (req, res) => {
    try {
        const userId = req.params.id
   
            console.log(userId);
            
        const user = await User.findByIdAndUpdate({ _id: userId }, { $set: { isBlocked: true } })
        await user.save()
        return res.redirect('/admin/users')
    } catch (error) {
        console.log(error);

    }
}


const unblockUsers = async (req, res) => {
    try {
        const userId = req.params.id
        const user = await User.findByIdAndUpdate({ _id: userId }, { $set: { isBlocked: false } })
        await user.save()
        return res.redirect('/admin/users')
    } catch (error) {
        console.log(error);

    }
}



const renderAddProducts = async (req, res) => {
    try {
        const category = await Categories.find()
        const brand = await Brand.find()
        const successMessage = req.flash('success')
        const errorMessage = req.flash('error')
        res.render("addproduct",{category, brand , messages: {error:errorMessage, success:successMessage}});
    } catch (error) {
        console.log(error);
    }
};

const addproduct = async(req, res)=>{
    try {
        const {productTitle, productDescription, price, stock, brandName, category} = req.body
        const name = productTitle
        const existence = await Product.findOne({title:new RegExp(name, 'i')})
        if(existence){
           return res.status(400).json({success:false, message: "Product with same name exist"})
        }
        const media = req.files.map(file => file.filename)
       

        const product = new Product({
            title:productTitle,
            description:productDescription,
            price,
            stock,
            images:media,
            brandName,
            category
        })
        await product.save()
        
        return res.json({ success: true, message: "Product added successfully" });

    } catch (error) {
        console.log(error);
        
    }
}

const blockProduct = async (req, res)=>{
    try {
        const productId = req.params.id
        const user = await Product.findByIdAndUpdate({ _id: productId }, { $set: { isBlocked: true } })
        await user.save()
        return res.redirect('/admin/products')
    } catch (error) {
        console.log(error);
        
    }
}

const unblockProduct = async (req, res)=>{
    try {
        const productId = req.params.id
        const user = await Product.findByIdAndUpdate({ _id: productId }, { $set: { isBlocked: false } })
        await user.save()
        return res.redirect('/admin/products')
    } catch (error) {
        console.log(error);
        
    }
}

const renderEditProducts = async (req, res) => {
    try {
        const productId = req.params.id
        const product = await Product.findById(productId).populate('brandName', 'brandName').populate('category','title')
        const category = await Categories.find()
        const brand = await Brand.find()
        const successMessage = req.flash('success')
        const errorMessage = req.flash('error')
        
        
        res.render("editproduct",{product, category, brand, messages: {error:errorMessage, success:successMessage}});
    } catch (error) {
        console.log(error);
    }
};

const editProduct = async (req, res) => {
    try {
        const { productTitle, productDescription, price, stock, brandName, category } = req.body;
        const productId = req.params.id;
        const imag = Array.isArray(req.body.removedImages) ? req.body.removedImages : [];

        if (imag.length > 0) {
            imag.forEach(image => {
                const filePath = path.join(__dirname, '..', 'public', image);
                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.error(`Error deleting file: ${filePath}`, err);
                    } else {
                        console.log(`Successfully deleted file: ${filePath}`);
                    }
                });
            });
        }

        const media = req.files && req.files.length > 0 ? req.files.map(file => file.filename) : [];
        const existingProduct = await Product.findOne({ title: new RegExp(`^${productTitle}$`, 'i') });
        if (existingProduct && existingProduct._id.toString() !== productId) {
            return res.status(400).json({ success: false, message: 'Product with similar name exists' });
        }

        const product = await Product.findById(productId);
        const existingImages = product.images.filter(image => !imag.includes(image));
        const updatedImages = [...existingImages, ...media];

        const updateData = {
            title: productTitle,
            description: productDescription,
            price,
            stock,
            brandName,
            category,
            images: updatedImages
        };

        await Product.findByIdAndUpdate(productId, updateData);
        return res.json({ success: true, message: "Product edited successfully" });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
    }
};



const renderBrands = async (req, res) => {
    try {
        const brand = await Brand.find({}).sort({createdAt:-1})
        res.render("brands", {brand});
    } catch (error) {
        console.log(error.message);
    }
};


const renderAddBrands = async (req, res) => {
    try {
        
        res.render("addbrands");
    } catch (error) {
        console.log(error.message);
    }
};

const addBrands = async (req,res)=>{
    try {
        const name = req.body.brandName
        
        const existence = await Brand.findOne({brandName:new RegExp(name,'i')})
        if(existence){
            return res.status(400).json({ success: false, message: "Brand exists" });
        }

        const newBrand = new Brand ({
            brandName:req.body.brandName,
            description:req.body.description
        })
        await newBrand.save()
        return res.json({ success: true, message: "Brand added successfully" });

        
    } catch (error) {
        console.log(error);
        
    }
}


const renderEditBrands = async (req, res) => {
    try {
        const userId = req.params.id
        const brand = await Brand.findById(userId)
        res.render("editbrands", {brand});
    } catch (error) {
        console.log(error.message);
    }
};

const blockBrand = async (req, res) => {
    try {
        const userId = req.params.id
        const user = await Brand.findByIdAndUpdate({ _id: userId }, { $set: { isBlocked: true } })
        await user.save()
        return res.redirect('/admin/brands')
    } catch (error) {
        console.log(error);

    }
}


const unblockBrand = async (req, res) => {
    try {
        const userId = req.params.id
        const user = await Brand.findByIdAndUpdate({ _id: userId }, { $set: { isBlocked: false } })
        await user.save()
        return res.redirect('/admin/brands')
    } catch (error) {
        console.log(error);

    }
}

const editBrand = async (req, res) => {
    try {
        const { brandName, description } = req.body;
        const brandId = req.params.id;

       
       
        const exist = await Brand.findOne({ brandName: new RegExp(`^${brandName}$`, 'i') });
        
        
        if (exist && exist._id.toString() !== brandId) {
            return res.status(400).json({ success: false, message: 'Brand exists' });
        }

        await Brand.findByIdAndUpdate(brandId, { brandName, description });
        return res.json({ success: true, message: "Edit Success" });
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
    }
};



const renderCategories = async (req, res) => {
    try {
        const category = await Categories.find({}).sort({createdAt:-1})

        res.render("categories", { category });
    } catch (error) {
        console.log(error.message);
    }
};


const renderAddCategories = async (req, res) => {
    try {
        res.render("addcategories");
    } catch (error) {
        console.log(error.message);
    }
};
const renderEditCategories = async (req, res) => {
    try {
        const userId = req.params.id
        const category = await Categories.findById(userId)
        const errorMessage = req.flash('error')
        res.render("editcategories", {category, errorMessage});
    } catch (error) {
        console.log(error.message);
    }
};

const addCategories = async (req, res) => {
    try {
        const title = req.body.title
        const existence = await Categories.findOne({ title: new RegExp(title, 'i') })
        if (existence) {
            
            return res.status(400).json({ success: false, message: "Category exists" });
        }

        const category = new Categories({
            title: req.body.title,
            description: req.body.description,
        })

        await category.save()
        return res.json({ success: true, message: "Category added successfully" });

    } catch (error) {
        console.log(error);

    }
}

const blockCategory = async (req, res) => {
    try {
        const userId = req.params.id
        const user = await Categories.findByIdAndUpdate({ _id: userId }, { $set: { isBlocked: true } })
        await user.save()
        return res.redirect('/admin/categories')
    } catch (error) {
        console.log(error);

    }
}


const unblockCategory = async (req, res) => {
    try {
        const userId = req.params.id
        const user = await Categories.findByIdAndUpdate({ _id: userId }, { $set: { isBlocked: false } })
        await user.save()
        return res.redirect('/admin/categories')
    } catch (error) {
        console.log(error);

    }
}


const editcategories = async (req, res) => {
    try {
        const { title, description } = req.body;
        const categoryId = req.params.id;

       
        const exist = await Categories.findOne({
            title: new RegExp(`^${title}$`, 'i'),
            _id: { $ne: categoryId } 
        });

        if (exist) {
            return res.status(400).json({ success: false, message: 'Category exists' });
        }

      
        await Categories.findByIdAndUpdate(categoryId, { title, description });
        return res.json({ success: true, message: "Edit Success" });

    } catch (error) {
        console.error("Error updating category:", error);
        return res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
    }
};


const renderOrder = async(req, res)=>{
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;
        const totalOrderCount = await Order.countDocuments();
        const totalPages = Math.ceil(totalOrderCount / limit);
        console.log(totalPages, totalOrderCount);
        
        const orders = await Order.find().skip(skip).limit(limit)

        res.render('orders',{orders, totalPages, currentPage: page,})
    } catch (error) {
        console.log(error);
        
    }
}

const renderOrderDetail = async(req, res)=>{
    try {
        const orderId = req.params.id
        
        
        const order = await Order.findById(orderId).populate('items.product')        
        const user = await User.findById(order.userId)

        res.render('orderdetail',{order, user})
    } catch (error) {
        console.log(error);
        
    }
}

const changeStatus = async (req, res) => {
    try {
        const orderId = req.params.id;
        const { status } = req.body;

        const order = await Order.findById(orderId).populate('items.product');

        if (!order) {
            return res.json({ success: false, message: "Order not found" });
        }

        if (order.status === 'Cancelled' || order.status === 'Delivered') {
            return res.json({ success: false, message: `Cannot change status, order is already ${order.status}.` });
        }
        if (status === 'Cancelled') {
            for (const item of order.items) {
                const product = item.product;
                if (product && item.productStatus !== 'Cancelled') {
                    item.productStatus="Cancelled"
                    product.stock += item.quantity;
                    await product.save();
                }
            }
        }

        order.status = status;
        await order.save();

        res.json({ success: true, message: "Status updated successfully" });
    } catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};


const cancelProduct = async (req, res) => {
    try {
        const { orderId, itemId } = req.params;
        const order = await Order.findById(orderId).populate('items.product');

        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

        const item = order.items.id(itemId);
        if (item) {

            item.productStatus = 'Cancelled';

            const product = item.product;
            if (product) {
                product.stock += item.quantity;
                await product.save();
            }
  
   
            await order.save();
  
           
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
        res.status(500).json({ success: false, message: 'Error canceling product' });
    }
};


const renderOffer = async(req, res)=>{
    try {
        const offers = await Offer.find().sort({createdAt:-1})
        .populate("applicableProducts", 'title')
      .populate("applicableCategories", 'title');
        res.render('offer', {offers})
    } catch (error) {
       console.log(error);
        
    }
}

const renderAddOffer = async(req, res)=>{
    try {
        const products = await Product.find({ isBlocked: false });
        const categories = await Categories.find({ isBlocked: false }); 
        console.log(categories);
        
        res.render('addoffer', {products, categories})
    } catch (error) {
       console.log(error);
        
    }
}

const addOffer = async(req, res)=>{
    try {
        const {
            offerName,
            offerType,
            discountPercentage,
            startDate,
            endDate,
            applicableProducts,
            applicableCategories,
          } = req.body;

          console.log();
          

          const newOffer = await Offer.create({
            offerName,
            offerType,
            discountPercentage,
            startDate,
            endDate,
            applicableProducts,
            applicableCategories
          })
          
          const percentage = newOffer.discountPercentage
          if(newOffer.offerType === 'product'){
            for(const product of newOffer.applicableProducts){
                let productOffer = await Product.findById(product)
                console.log(product);
                
                if(productOffer){
                    productOffer.isDiscounted = true;
                    productOffer.offerId = newOffer._id;
                    productOffer.offerPercentage = percentage;
                    await productOffer.save()
                }
            }
          }
           else {
            for (const category of newOffer.applicableCategories) {
              let categoryOffer = await Product.find({ category });
              for (const product of categoryOffer) {
                product.isDiscounted = true;
                product.offerId = newOffer._id;
                product.offerPercentage = percentage;
                await product.save();
              }
            }
          }
          if(newOffer){
            return res.status(200).json({success:true, message:"New offer added"})
            
          }

    } catch (error) {
       console.error(error);
       res.status(500).json({ success: false, message: "Internal server error" });

    }
}

const listOffer = async(req, res)=>{
    try {
        
        const offerId = req.params.id
        console.log(offerId);
        
        await Offer.findByIdAndUpdate({_id:offerId}, {$set:{isListed:true}})
        const products = await Product.find({offerId})
        console.log(products);

        for(let product of products){
            product.isDiscounted=true
            await product.save()
        }
        return res.status(200).json({success:true, message:"Offer is now listed."})

    } catch (error) {
        console.log(error);
        
    }
}

const unlistOffer = async(req, res)=>{
    try {
   
        
        const offerId = req.params.id
        
        
        await Offer.findByIdAndUpdate({_id:offerId}, {$set:{isListed:false}})
        const products = await Product.find({offerId})
        console.log(products);
        
        for(let product of products){
            product.isDiscounted=false
            await product.save()
        }
        return res.status(200).json({success:true, message:"Offer is now unlisted."})
        
    } catch (error) {
        console.log(error);
        
    }
}


const renderCoupon = async(req, res)=>{
    try {
        const coupons = await Coupon.find({}).sort({createdAt:-1})
        res.render('coupon',{coupons})
    } catch (error) {
       console.log(error);
        
    }
}

const renderAddCoupon = async(req, res)=>{
    try {
        res.render('addcoupon')
    } catch (error) {
       console.log(error);
        
    }
}

const addCoupon = async(req, res)=>{
    try {
        const{ couponCode, description, discount, minPurchaseAmount, maxDiscountAmount, expiryDate } = req.body

        const existing = await Coupon.findOne({couponCode})

        if(existing){
            return res.status(400).json({success:false, message:'Coupon with similar code exist'})
        }

        const newCoupon = new Coupon ({
            couponCode,
            description,
            discount,
            minPurchaseAmount,
            maxDiscountAmount,
            expiryDate
        })

        await newCoupon.save()
        return res.status(200).json({success:true, message:"Coupon created successfully"})

    } catch (error) {
       console.log(error);
        
    }
}

const deleteCoupon = async (req, res)=>{
    try {
        const couponId = req.params.id
        await Coupon.findByIdAndDelete(couponId)
        console.log(couponId);
        
        
        
        console.log('done');
        
        return res.status(200).json({success:true, message:"Coupon Successfully deleted"})
        
    } catch (error) {
        console.log(error);
        
    }
}



const renderSalesReport = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;
        const startDate = req.query.startDate ? new Date(req.query.startDate) : null;
        const endDate = req.query.endDate ? new Date(req.query.endDate) : null;
        const filterType = req.query.filterType || 'all';
        const filter = { status: "Delivered" };
        if (startDate && endDate) {
            filter.orderDate = {
                $gte: startDate,
                $lte: endDate
            };
        }
        const currentDate = new Date();
        if (filterType === 'daily') {
            filter.orderDate = {
                $gte: new Date(currentDate.setHours(0, 0, 0, 0)),
                $lt: new Date(currentDate.setHours(23, 59, 59, 999))
            };
        } else if (filterType === 'weekly') {
            const startOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay()));
            filter.orderDate = { $gte: startOfWeek };
        } else if (filterType === 'monthly') {
            const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
            filter.orderDate = { $gte: startOfMonth };
        } else if (filterType === 'yearly') {
            const startOfYear = new Date(currentDate.getFullYear(), 0, 1);
            filter.orderDate = { $gte: startOfYear };
        }
        const totalOrderCount = await Order.countDocuments(filter);
        const totalPages = Math.ceil(totalOrderCount / limit);
        const orders = await Order.find(filter)
            .skip(skip)
            .limit(limit);
        res.render('salesreport', {
            orders,
            totalPages,
            currentPage: page,
            filterType,
            startDate: req.query.startDate || '',
            endDate: req.query.endDate || '',
            noOrders: orders.length === 0
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};



const logout = async (req, res) => {
    try {
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      return res.redirect("/auth/adminlogin");
    } catch (error) {
      console.log(error);
    }
  };

module.exports = {
    renderDashboard,
    renderProducts,
    renderUsers,
    renderBrands,
    renderAddProducts,
    addproduct,
    blockProduct,
    unblockProduct,
    renderEditProducts,
    editProduct,
    blockUsers,
    unblockUsers,
    renderAddBrands,
    renderEditBrands,
    addBrands,
    editBrand,
    blockBrand,
    unblockBrand,
    renderCategories,
    renderEditCategories,
    renderAddCategories,
    addCategories,
    blockCategory,
    unblockCategory,
    editcategories,
    renderOrder,
    renderOrderDetail,
    changeStatus,
    cancelProduct,
    renderOffer,
    renderAddOffer,
    addOffer,
    listOffer,
    unlistOffer,
    renderCoupon,
    renderAddCoupon,
    addCoupon,
    deleteCoupon,
    renderSalesReport,
    logout

};
