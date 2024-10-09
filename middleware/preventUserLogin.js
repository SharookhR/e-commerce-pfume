const jwt = require('jsonwebtoken')
require('dotenv').config()
const checkLogin = async(req, res, next)=>{
    const token = req.cookies.accessToken
    try {
        if(token){
        const decoded = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        if(decoded){
           return res.redirect('/user/home')
        }else{
            next()
        }
    }
     next()   
    } catch (error) {
        console.log(error);
        
    }
}

module.exports={checkLogin}