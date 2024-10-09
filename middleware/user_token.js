const jwt =  require('jsonwebtoken')
const {generateAccessToken} =require('../utility/token')
require('dotenv').config()

const verifyRefreshToken = async (req, res, next)=>{
    const refreshToken = req.cookies.refreshToken
    const accessToken = req.cookies.accessToken 
    try {
        if(accessToken){
            console.log("Access token found");
            const decode = jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET)
            req.userId = decode.userId
            return next()
        }
        else{
            if(!refreshToken){
                res.redirect('/auth/login')
                console.log("Refresh token expired");
                
            }
            else{
                const decode = jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET)
                console.log(req.userId);
                req.userId = decode.userId
                console.log(req.userId);
                const userId = decode.userId
                console.log(userId);
                
                if(decode){

                    const newAccessToken = generateAccessToken(userId)
                    res.cookie('accessToken', newAccessToken, {
                        httpOnly:true,
                        secure:process.env.NODE_ENV==='production',
                        maxAge: 1 * 60 * 1000
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