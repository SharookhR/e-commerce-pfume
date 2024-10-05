const jwt =  require('jsonwebtoken')

const verifyToken = (req, res, next)=>{
    const token = req.cookies.token

    if(!token){
        return res.status(401).json({success: false, message: "No token provided, authorization denied"});
    }
}
try {
    const decoded = jwt.verify(token, process.env.JWT_OTP_TOKEN);
    req.userid = decoded.userId;
    next()
} catch (error) {
    console.error("JWT verification failed:", error);
    return res.status(401).json({success: false, message: 'Invalid Token'})
}

module.exports=verifyToken