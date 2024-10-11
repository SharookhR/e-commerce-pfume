const { status } = require("express/lib/response");
const User = require("../Model/UserModel");

const renderDashboard = async (req, res) => {
  try {
    res.render("dashboard");
  } catch (error) {
    console.log(error.message);
  }
};
const renderProducts = async (req, res) => {
  try {
    res.render("products");
  } catch (error) {
    console.log(error.message);
  }
};
const renderUsers = async (req, res) => {

  try {
    const user = await User.find({isAdmin:0});
    return res.render("users", { user });
  } catch (error) {
    console.log(error);
  }
};

const blockUsers = async(req, res)=>{
    try {
        const userId = req.params.id
        console.log(userId);
        
        const user = await User.findByIdAndUpdate({_id:userId},{$set:{isBlocked:true}})
        await user.save()
        return res.redirect('/admin/users')
    } catch (error) {
        console.log(error);
        
    }
}


const unblockUsers = async(req, res)=>{
    try {
        const userId = req.params.id
        const user = await User.findByIdAndUpdate({_id:userId},{$set:{isBlocked:false}})
        await user.save()
        return res.redirect('/admin/users')
    } catch (error) {
        console.log(error);
        
    }
}



const renderAddProducts = async (req, res) => {
  try {
    res.render("addproduct");
  } catch (error) {
    console.log(error);
  }
};

const renderEditProducts = async (req, res) => {
  try {
    res.render("editproduct");
  } catch (error) {
    console.log(error);
  }
};

const renderBrands = async (req, res) => {
    try {
      res.render("brands");
    } catch (error) {
      console.log(error.message);
    }
  };


  const renderAddBrands = async (req, res) => {
    try {
      res.render("addbrands");
    } catch (error) {
      console.log(error.message);
    }
  }; 
  const renderEditBrands = async (req, res) => {
    try {
      res.render("editbrands");
    } catch (error) {
      console.log(error.message);
    }
  };

  const renderCategories = async (req, res) => {
    try {
      res.render("categories");
    } catch (error) {
      console.log(error.message);
    }
  };


  const renderAddCategories= async (req, res) => {
    try {
      res.render("addcategories");
    } catch (error) {
      console.log(error.message);
    }
  }; 
  const renderEditCategories = async (req, res) => {
    try {
      res.render("editcategories");
    } catch (error) {
      console.log(error.message);
    }
  };


module.exports = {
  renderDashboard,
  renderProducts,
  renderUsers,
  renderBrands,
  renderAddProducts,
  renderEditProducts,
  blockUsers,
  unblockUsers,
  renderAddBrands,
  renderEditBrands,
  renderCategories,
  renderEditCategories,
  renderAddCategories

};
