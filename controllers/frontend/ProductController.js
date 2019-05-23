var express = require('express')
var bcrypt = require('bcryptjs')
//Chèn models
var Product = require('../../models/product')
var Catproduct = require('../../models/catproduct')
var Styleproduct = require('../../models/styleproduct')
var Setting = require('../../models/setting')
var Menu = require('../../models/menu')
var Photo = require('../../models/photo')
var Alias = require("../../models/alias")
var productController = {}
var router = express.Router()
const url = require('url')
//router.use(csrfProtection);
productController.detail = async function(req,res,next) {
    var query = await url.parse(req.url,true)
    var data_alias = await Alias.findOne({path:query.path.slice(1)})
    if(data_alias){
        if(data_alias.name_table=="product"){
            let itemproduct = await Product.findOne({_id: data_alias.id_table})
            //res.send(itemproduct)
            let datacat = await Catproduct.find({})
            let itemcatproduct = await Catproduct.findOne({_id: itemproduct.category_id})
            let htmlBreakcrum = await breakcrumtab(itemcatproduct)
            //res.send(htmlBreakcrum)
            //Cấu hình hệ thống
            let settings = await Setting.findOne({lang: "vi"}).populate('logo')
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
            res.render('frontend/product/detail', {
                title: 'Chi tiết sản phẩm',
                classBody: 'catalog-view_op1',
                urlRoot: req.get('host'),
                settings: settings,
                menu: datamenu,
                htmlBreakcrum: htmlBreakcrum,
                datamenuBottom: datamenuBottom,
                itemproduct:itemproduct,
                itemcatproduct:itemcatproduct,
              })
        }else{
            next()
        }
    }
}
async function getitemcat(data, itemdata){
    for(i=0; i<data.length; i++){
        if(itemdata.parent_id==data[i]._id){
            return data[i]
        }
    }
}
async function breakcrumtab(itemcat){
    //return data
    // <ol class="breadcrumb no-hide">
    //     <li><a href="#">Trang chủ    </a></li>
    //     <li><a href="#">Electronics    </a></li>
    //     <li class="active">Machine Pro</li>
    // </ol>
    var arr = await []
    //arr[0] = await {slug:'',name:"Trang chủ"}
    if(itemcat.parent_id!=null){
        let itemcat1 = await Catproduct.findOne({_id: itemcat.parent_id})
        //return itemcat1
        arr[0] = {slug:itemcat1.slug,name:itemcat1.name}
        if(itemcat1.parent_id!=null){
            let itemcat2 = await Catproduct.findOne({_id: itemcat1.parent_id})
            arr[1] = await {slug:itemcat2.slug,name:itemcat2.name}
            if(itemcat2.parent_id!=null){
                let itemcat3 = await Catproduct.findOne({_id: itemcat2.parent_id})
                arr[2] = await {slug:itemcat3.slug,name:itemcat3.name}
                if(itemcat3.parent_id!=null){
                    let itemcat4 = await Catproduct.findOne({_id: itemcat3.parent_id})
                    arr[3] = await {slug:itemcat4.slug,name:itemcat4.name}
                }
            }
        }
    }else{
        arr[0] = await {slug:itemcat.slug,name:itemcat.name}
    }
    var datare = arr.reverse()
    return datare;
}
productController.listproduct = async function(req, res, next) {
    var query = await url.parse(req.url,true)
    var data_alias = await Alias.findOne({path: query.path.slice(1)})
    if(data_alias){
        if(data_alias.name_table=="catproduct"){
            let itemCatproduct = await Catproduct.findOne({_id: data_alias.id_table})
            let listproduct = await Product.find({_id: {$in: itemCatproduct.arr_id_product}})
            //res.send(listproduct);
            //Cấu hình hệ thống
            let settings = await Setting.findOne({lang: "vi"}).populate('logo')
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
            res.render('frontend/product/list', {
                title: 'Danh sách sản phẩm',
                classBody: 'catalog-view_op1',
                urlRoot: req.get('host'),
                settings: settings,
                menu: datamenu,
                datamenuBottom: datamenuBottom,
                itemCatproduct: itemCatproduct,
                listproduct: listproduct,
              })
        }else{
            next()
        }
    }
}
module.exports = productController;