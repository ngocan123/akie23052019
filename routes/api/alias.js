var express = require('express');
var router = express.Router();
var aliasControllers = require('../../controllers/api/AliasController');
router.get('/getAll', aliasControllers.getAll);
module.exports = router;