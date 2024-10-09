const express = require('express')
const user = require('./userRoute')
const auth = require('./authRoute')
const admin = require('./adminRoute')
const router = express.Router()

router.use('/auth', auth)
router.use('/user', user)
router.use('/admin', admin)

module.exports=router