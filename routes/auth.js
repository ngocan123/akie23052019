const authController = require('../controllers/frontend/AuthController')  // this is require our newly created UserController

var express = require('express');
var router = express.Router();
router.get('/user', authController.checkToken);
router.post('/login', authController.loginAttempt);
module.exports = router;


// module.exports = (router) => {
//     router
//         .route('/auth/login').post(authController.loginAttempt)

// 	router
//         .route('/auth/user').get(authController.checkToken)    
// }