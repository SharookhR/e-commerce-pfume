const jwt =  require('jsonwebtoken')

const verifyToken = (req, res, next)=>{
    const token = req.cookies.token
    
    if (!token) {
        return res.status(401).json({ success: false, message: 'No token provided, authorization denied' });
    }
    try {
        
        const decoded = jwt.verify(token, process.env.JWT_OTP_TOKEN);
        
        
        req.userId = decoded.userId; // decodeding { userId: '...', iat, exp }
        next(); // Move to the next middleware or route handler
    } catch (error) {
        console.error('JWT verification failed:', error);
        return res.status(401).json({ success: false, message: 'Invalid token' });
    }

}


module.exports={ verifyToken }