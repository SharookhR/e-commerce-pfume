const jwt =  require('jsonwebtoken')

const verifyForgetToken = (req, res, next)=>{
    const token = req.cookies.token
    
    

    if(!token){
        return res.redirect('/auth/login/forgotpassword')
    }
    try {
        const decode = jwt.verify(token,process.env.JWT_OTP_TOKEN)
        req.userId = decode.userId
        
        
        
        next()
    } catch (error) {
        console.log('No token found',error)
    }
}


module.exports={ verifyForgetToken }
