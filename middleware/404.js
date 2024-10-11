const errorPage = async(req, res )=>{
    try {
       return res.render('404')
    } catch (error) {
        console.log(error);
        
    }
}

module.exports= {errorPage}