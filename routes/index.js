var express = require('express');
var router = express.Router();
var Product = require('../models/product');
var Setting = require('../models/setting');
const url = require('url');
/* GET home page. */
router.get('/',async function(req, res, next) {
  let products = await Product.find({}).exec();
  let settings = await Setting.findOne({}).populate('logo').exec();
  res.render('frontend/index', { title: 'Trang chu' , products: products, settings: settings});
});
module.exports = router;
