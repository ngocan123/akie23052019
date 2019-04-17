var express = require('express');
var app = express();
var router = express.Router();
const productController = require('../../controllers/backend/ProductController');
const verifyToken = require('../../Middlewares/JwtAuthMiddleware');

router.get('/', productController.list);
router.get('/list', productController.list);
router.get('/getAll', productController.getAll);
router.get('/getAlltags', productController.getAlltags);
router.get('/show/:id', productController.show);
router.post('/store', productController.store);
router.post('/update/:id', productController.update);
router.post('/remove', productController.remove);
router.post('/saveProductAndTag', productController.saveProductAndTag);
router.post('/saveProductAndTagAsync', productController.saveProductAndTagAsync);
module.exports = router;