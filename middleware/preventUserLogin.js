const jwt = require("jsonwebtoken");
require("dotenv").config();
const preventUserLogin = async (req, res, next) => {
  const token = req.cookies.accessToken;
  if (token) {
    try {
      try {
        const decoded = await jwt.verify(
          token,
          process.env.ACCESS_TOKEN_SECRET
        );
        if (decoded) {
          return res.redirect("/user/home");
        } else {
          next();
        }
      } catch (error) {
        next();
      }
    } catch (error) {
      console.log(error);
    }
  } else {
    next();
  }
};
module.exports = { preventUserLogin };
