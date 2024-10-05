const jwt = require('jsonwebtoken')
require('dotenv').config()

const generateToken = (userId,secret,expiresIn)=>{
    return jwt.sign({userId},secret, {expiresIn})
}

const generateAccessToken = (userId)=>{
    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET
    const accessTokenExpires = '1m'
    return generateToken(userId,accessTokenSecret,accessTokenExpires)
}

const generateRefreshToken = (userId)=>{
    const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET
    const refreshTokenExpires= '2m'
    return generateToken(userId,refreshTokenSecret, refreshTokenExpires)
}

module.exports ={
    generateAccessToken,
    generateRefreshToken
}