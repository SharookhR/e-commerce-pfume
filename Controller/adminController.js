const { status } = require("express/lib/response");
const User = require("../Model/UserModel");
const Categories = require('../Model/categoryModel');
const Brand = require("../Model/brandModel");
const Product = require('../Model/productModel')

const renderDashboard = async (req, res) => {
    try {
    
        res.render("dashboard");
    } catch (error) {
        
        console.log(error.message);
    }
};
const renderProducts = async (req, res) => {
    try {
        const products = await Product.find().populate('brandName', 'brandName').populate('category','title')
        res.render("products",{products});
    } catch (error) {
        console.log(error.message);
    }
};
const renderUsers = async (req, res) => {

    try {
        const user = await User.find({ isAdmin: 0 });
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
        res.render("addproduct",{category, brand });
    } catch (error) {
        console.log(error);
    }
};

const addproduct = async(req, res)=>{
    try {
        const {productTitle, productDescription, price, stock, brandName, category} = req.body
        const productNameLower = productTitle.toLowerCase()
        const existence = await Product.findOne({title:productNameLower})
        if(existence){
           return res.send("product exist")
        }
        if(!req.files ||req.files.length < 3){
            return res.send('Add atleast three images')
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
        return res.send("product added")

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
        console.log(product);
        
        
        // if(!product){
        //     return res.send('no product')
        // }
        const category = await Categories.find()
        const brand = await Brand.find()
        res.render("editproduct",{product, category, brand });
    } catch (error) {
        console.log(error);
    }
};

const editProduct = async(req, res)=>{
    try {
        const {productTitle, productDescription, price, stock, brandName, category} = req.body
        const productId = req.params.id
        const media = req.files.map(file => file.filename)
        await Product.findByIdAndUpdate(productId,{
            title:productTitle,
            description:productDescription,
            price,
            stock,
            images:media,
            brandName,
            category
        })
        return res.send("Edited")
    } catch (error) {
        console.log(error);
        
    }
}

const renderBrands = async (req, res) => {
    try {
        const brand = await Brand.find({})
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
        const existence = await Brand.findOne({brandName:req.body.brandName})
        if(existence){
           return res.redirect('/admin/brands')
        }

        const newBrand = new Brand ({
            brandName:req.body.brandName,
            description:req.body.description
        })
        await newBrand.save()
        res.redirect('/admin/addbrands')
        
    } catch (error) {
        console.log(error);
        
    }
}


const renderEditBrands = async (req, res) => {
    try {
        const userId = req.params.id
        const brand = await Brand.findById(userId)
        console.log(userId);
        console.log(brand);
        
        

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

const editBrand = async (req,res)=>{
    try {
        const {brandName, description} = req.body
        const brandId= req.params.id
        await Brand.findByIdAndUpdate(brandId, {
            brandName,
            description
        })
        return res.redirect('/admin/brands')
        
    } catch (error) {
        console.log(error);
        
    }
}


const renderCategories = async (req, res) => {
    try {
        const category = await Categories.find({})

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
    
        res.render("editcategories", {category});
    } catch (error) {
        console.log(error.message);
    }
};

const addCategories = async (req, res) => {
    try {

        const existence = await Categories.findOne({ title: req.body.title })
        if (existence) {
            return res.redirect('/admin/addcategories')
        }

        const category = new Categories({
            title: req.body.title,
            description: req.body.description,
        })

        await category.save()
        console.log("New category added");
        return res.redirect("/admin/addcategories")

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

const editcategories = async (req,res)=>{
    try {
        const {title, description} = req.body
        const categoryId = req.params.id
        await Categories.findByIdAndUpdate(categoryId, {
            title,
            description
        })
        return res.redirect('/admin/categories')
        
    } catch (error) {
        console.log(error);
        
    }
}

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

};
