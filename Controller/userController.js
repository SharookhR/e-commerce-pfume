const User = require('../Model/UserModel')

const home = async (req, res)=>{
    try {
        const userId = req.userId
        const checkUser = await User.findById(userId)
        if(checkUser.isBlocked){
            res.clearCookie("accessToken")
            res.clearCookie('refreshToken')
            return res.render('login', {errorMessage:"You were banned by admin"})
        }
        
       return res.render("home")
    } catch (error) {
        console.log(error.message);
        
    }
}
module.exports={
    home
}