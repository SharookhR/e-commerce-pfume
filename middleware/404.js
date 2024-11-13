const userErrorPage = async(req, res )=>{
    try {
       return res.render('404')
    } catch (error) {
        console.log(error);
        
    }
}

const adminErrorPage = async(req, res )=>{
    try {
       return res.render('admin404')
    } catch (error) {
        console.log(error);
        
    }
}

module.exports= {
    userErrorPage,
    adminErrorPage
}