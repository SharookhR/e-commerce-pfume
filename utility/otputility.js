const nodemailer = require('nodemailer')
require('dotenv').config()

const tempData = require('../Model/tempUser')

const generateOtp = () => {
    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000)
    const lastOtp = new Date(Date.now() + 1 * 60 * 1000)
    console.log(otp);
    
    return { otp, otpExpiresAt, lastOtp}
}

const sendOtpEmail = async (email, otp) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASS
        }, 
    
    })

const mailOption = {
    from: process.env.EMAIL,
    to: email,
    subject: "OTP for account verification",
    text: `Your OTP is ${otp} .  Valid for 5 minutes`
}

try {
    await transporter.sendMail(mailOption)
    console.log(`OTP sent to ${email}`);

} catch (error) {
    console.log(`Error sending email to ${email}`);
    throw new Error('Failed to send OTP')

}
}
module.exports = {
    generateOtp,
    sendOtpEmail
}