var express = require('express')
var app = express()
var router = express.Router()
//Api controller
var Product = require('../models/product')
var Catproduct = require('../models/catproduct')
var Styleproduct = require('../models/styleproduct')
var Setting = require('../models/setting')
var Menu = require('../models/menu')
var Photo = require('../models/photo')
//thêm Controller
const siteController = require('../controllers/frontend/SiteController')
const productController = require('../controllers/frontend/ProductController')
const catproductController = require('../controllers/api/CatProductController')
const url = require('url');
/* GET home page. */
router.get('/',async function(req, res, next) {
  let products = await Product.find({})
  let catproducts = await Catproduct.find({parent_id: null})
  let styleproducts = await Styleproduct.find({})
  //styleproducts[0].active = 'active';
  let settings = await Setting.findOne({lang: "vi"}).populate('logo')
  let menu = await Menu.find({parent_id: null})
  let test_arr = [];
  let test_arr1 = [];
  for(i=0;i < catproducts.length;i++){
    catproducts[i].styles = styleproducts;
    catproducts[i].children = await Catproduct.find({_id:{$in:catproducts[i].childs}})
    test_arr1[i] = catproducts[i].arr_id_product
    for(j=0; j < styleproducts.length; j++){
      test_arr[j] = catproducts[i].styles[j].arr_product_ids
      catproducts[i].styles[j].listproductstyle = await Product.find({ $and: [ {_id: {$in: test_arr1[i]} }, {_id: {$in: test_arr[j]}} ] }).populate('imageNumber')
      var productChunks = await []
      var chunkSize = await 2
      for(var n=0; n<catproducts[i].styles[j].listproductstyle.length; n+=chunkSize){
        await productChunks.push(catproducts[i].styles[j].listproductstyle.slice(n, n + chunkSize))
      }
      catproducts[i].styles[j].listproductstyle = productChunks
    }
  }
  //Hiển thị menu top
  var datamenu = await Menu.find({keyname:"menu_top",parent_id: null})
  if(datamenu.length>0){
    for(i=0; i<datamenu.length; i++){
      datamenu[i].children = await Menu.find({parent_id:datamenu[i]._id})
      if(datamenu[i].children.length>0){
        for(j=0; j<datamenu[i].children.length; j++){
          datamenu[i].children[j].children = await Menu.find({parent_id:datamenu[i].children[j]._id})
        }
      }
    }
  }
  //Hiển thị menu chân trang
  var datamenuBottom = await Menu.find({keyname:"menu_bottom",parent_id: null})
  if(datamenuBottom.length>0){
    for(i=0; i<datamenuBottom.length; i++){
      datamenuBottom[i].children = await Menu.find({parent_id:datamenuBottom[i]._id})
      if(datamenuBottom[i].children.length>0){
        for(j=0; j<datamenuBottom[i].children.length; j++){
          datamenuBottom[i].children[j].children = await Menu.find({parent_id:datamenuBottom[i].children[j]._id})
        }
      }
    }
  }
  //Hiển thị sldier trang chủ (sldier_home)
  var sliderHome = await Photo.find({keyname: "slider_home"})
  //res.send(photo)
  res.render('frontend/home/index', {
    urlRoot: req.get('host'),
    classBody: 'index-opt-2',
    title: 'Trang chủ',
    products: products,
    settings: settings,
    menu: datamenu,
    datamenuBottom: datamenuBottom,
    catproducts: catproducts,
    sliderHome: sliderHome,
  })
})
router.get('/:any', productController.detail, productController.listproduct)
router.get('/:any/:any1', productController.listproduct, productController.detail)
router.get('/:any/:any1/:any2', productController.detail, productController.listproduct)
router.get('/:any/:any1/:any2/:any3', productController.detail, productController.listproduct)
router.get('/:any/:any1/:any2/:any3/:any4', productController.detail, productController.listproduct)
router.get('/:any/:any1/:any2/:any3/:any4/:any5', productController.detail, productController.listproduct)
module.exports = router;
