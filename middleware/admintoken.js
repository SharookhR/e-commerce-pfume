const jwt = require("jsonwebtoken");
const { generateAccessToken } = require("../utility/token");
require("dotenv").config();
const User = require("../Model/UserModel");

const verifyRefreshTokenAdmin = async (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;

  try {
    if (accessToken) {
      console.log("Access token found");
      try {
        const decoded = jwt.verify(
          accessToken,
          process.env.ACCESS_TOKEN_SECRET
        );
        if (!decoded) {
          return res.redirect("/auth/adminlogin");
        }
        req.userId = decoded.userId;
        const checkAdmin = decoded.userId;
        const admin = await User.findById(checkAdmin);
        if (admin.isAdmin) {
        next();
        } else {
          return res.redirect("/auth/login");
        }
      } catch (error) {
        return res.redirect("/auth/adminlogin");
      }
    } else {
      if (!refreshToken) {
        console.log("Refresh token expired");
        return res.redirect("/auth/adminlogin");
      
        
      } else {
        const decode = jwt.verify(
          refreshToken,
          process.env.REFRESH_TOKEN_SECRET
        );
        req.userId = decode.userId;
        userId = decode.userId;

        if (decode) {
          
          const newAccessToken = generateAccessToken(userId);
          console.log("New access token created");

          res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 10 *  6 * 1000,
          });
          next();
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = { verifyRefreshTokenAdmin };
