const express = require('express')
const { loginController, registerController } = require('../controllers/userController')


 // router object

 const router  = express.Router()


 // routers npm
//POST || LOGIN

router.post('/login',loginController)


//POST || RESIGstER usser
router.post('/register', registerController )




module.exports = router