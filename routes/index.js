var express = require('express');
var router = express.Router();
var Product = require('../models/product');
var Catproduct = require('../models/catproduct');
var Styleproduct = require('../models/styleproduct');
var Setting = require('../models/setting');
var Menu = require('../models/menu');
const url = require('url');
/* GET home page. */
router.get('/',async function(req, res, next) {
  let products = await Product.find({});
  let catproducts = await Catproduct.find({parent_id: null});
  let styleproducts = await Styleproduct.find({});
  //styleproducts[0].active = 'active';
  let settings = await Setting.findOne({lang: "vi"}).populate('logo');
  let menu = await Menu.find({parent_id: null});
  for(i=0;i < catproducts.length;i++){
    catproducts[i].styles = styleproducts;
    catproducts[i].children = await Catproduct.find({_id:{$in:catproducts[i].childs}});
  }
  // let datalistproduct = await catproducts.map(function(item, index){
  //   var Styleproduct = require('../models/styleproduct');
  //   let catstyle = Styleproduct.map(function(item, index){
  //     return item;
  //   });
  //   return catstyle;
  // });
  //res.send(catproducts);
  res.render('frontend/home/index', { 
    title: 'Trang chủ', 
    products: products,
    settings: settings,
    menu: menu,
    catproducts: catproducts
  });
});
module.exports = router;
