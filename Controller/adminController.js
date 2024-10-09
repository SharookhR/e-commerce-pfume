const User = require('../Model/UserModel')

const dashboard = async (req, res)=>{
    try {
        res.render("dashboard")
    } catch (error) {
        console.log(error.message);
        
    }
}
const products  =async (req, res)=>{
    try {
        res.render('products')
    } catch (error) {
        console.log(error.message);
    }
}
const orders  =async (req, res)=>{
    try {
        res.render('orders')
    } catch (error) {
        console.log(error.message);
    }
}

const brands  =async (req, res)=>{
    try {
        res.render('brands')
    } catch (error) {
        console.log(error.message);
    }
}

module.exports={
    dashboard,
    products,
    orders,
    brands

}