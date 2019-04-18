var express = require('express');
var router = express.Router();
var adminControllers = require('../../controllers/api/AdminController');
var JwtAuthMiddleware = require('../../Middlewares/JwtAuthMiddleware');
router.get('/list/', JwtAuthMiddleware, adminControllers.list);
router.get('/show/:id', JwtAuthMiddleware, adminControllers.show);
router.post('/store', adminControllers.store);
router.post('/update/:id', JwtAuthMiddleware, adminControllers.update);

module.exports = router;