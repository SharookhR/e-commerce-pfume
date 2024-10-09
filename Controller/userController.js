const User = require('../Model/UserModel')

const home = async (req, res)=>{
    try {
        res.render("home")
    } catch (error) {
        console.log(error.message);
        
    }
}
module.exports={
    home
}