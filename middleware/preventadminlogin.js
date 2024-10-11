const jwt = require('jsonwebtoken')
require('dotenv').config()
const User = require('../Model/UserModel')

const preventAdminLogin = async (req, res, next) => {
   
    const token = req.cookies.accessToken
    if (token) {
        console.log('Access token found');
        try {
            try {
                
                const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
             
          
                if (decoded) {
                    
                    
                    const checkingUser = decoded.userId
                    const user = await User.findById(checkingUser)
                    
                    if(user.isAdmin!=0){
                        return res.redirect('/admin/dashboard')
                    }
                    else{
                       next()
                    }
                } else {
                    next()
                }
            } catch (error) {
               console.log(error);
                next()
            }
        } catch (error) {
            console.log(error);
            next()
        }
    } else {

        next()
    }
}

module.exports = { preventAdminLogin }