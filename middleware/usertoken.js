const jwt =  require('jsonwebtoken')
const {generateAccessToken} =require('../utility/token')
const User = require('../Model/UserModel')
require('dotenv').config()

const verifyRefreshToken = async (req, res, next)=>{
    const refreshToken = req.cookies.refreshToken
    const accessToken = req.cookies.accessToken 
    try {
        if(accessToken){
            console.log("Access token found");
            try {
                const decode = jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET)
                if(!decode){
                    return res.redirect('/auth/login')
                }
                req.userId = decode.userId
                const userId = decode.userId

                const user = await User.findById(userId)

                if(user.isBlocked){
                    res.clearCookie("accessToken");
                    res.clearCookie('refreshToken')
                    return res.redirect("/auth/login")
                }

                return next()

            } catch (error) {
                return res.redirect('/auth/login')
                console.log(error);
                
            }  
        }
        else{
            if(!refreshToken){
                res.redirect('/auth/login')
                console.log("Refresh token expired");
                
            }
            else{
                const decode = jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET)
                req.userId = decode.userId
                const userId = decode.userId
                
                if(decode){

                    const newAccessToken = generateAccessToken(userId)
                    res.cookie('accessToken', newAccessToken, {
                        httpOnly:true,
                        secure:process.env.NODE_ENV==='production',
                        maxAge: 10 * 60 * 1000
                    })
                    next()
                }
            }
        }
    } catch (error) {
        console.log("Access token expired or invalid", error);
        
    }
}

module.exports={verifyRefreshToken}