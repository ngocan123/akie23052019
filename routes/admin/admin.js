var express = require('express');
var router = express.Router();
var adminControllers = require('../../controllers/backend/AdminController');
//var JwtAuthMiddleware = require('../../Middlewares/JwtAuthMiddleware');
router.get('/list/', adminControllers.list);
router.get('/show/:id', adminControllers.show);
router.post('/store', adminControllers.store);
router.post('/update/:id', adminControllers.update);

module.exports = router;