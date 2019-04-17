var express = require('express');
var app = express();
var router = express.Router();
const catproductController = require('../../controllers/api/CatProductController');
const verifyToken = require('../../Middlewares/JwtAuthMiddleware');
//========End fix upload image
router.get('/list', catproductController.list);
router.get('/getAll', catproductController.getAll);
router.get('/show/:id', catproductController.show);
router.post('/store', catproductController.store);
router.post('/update/:id', catproductController.update);
router.post('/remove', catproductController.remove);
module.exports = router;