const express = require('express')
const userController = require('../Controller/userController')

const {errorPage} = require('../middleware/404')
const router = express.Router()


router.route('/home').get(userController.home)
router.use(errorPage)


module.exports=router