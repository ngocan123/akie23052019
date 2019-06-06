const express = require('express')
const slugify = require('slugify')
slugify.extend({'đ': 'd'})
const Product = require("../../models/product")
const Tag = require("../../models/tag")
const Catproduct = require('../../models/catproduct')
const Styleproduct = require('../../models/styleproduct')
const Supplierproduct = require('../../models/supplier')
const Alias = require('../../models/alias')
const url = require('url')
const productController = {}
productController.list = function(req, res, next){
    //res.send(req);
    const filter = {};
    const query = url.parse(req.url,true).query;
    //===================paginattion
    var perPage = query.perPage || 10
    var page = query.page || 1
    //===================end pagination
    //res.send(query);
    if(query){
        // NodeJs Mongoose find like Reference from
        // https://stackoverflow.com/questions/9824010/mongoose-js-find-user-by-username-like-value
        const keyword = new RegExp(query.keyword, 'i'); // it return /keyword/i            

        // NodeJs Mongoose query find OR Reference From
        // https://stackoverflow.com/questions/33898159/mongoose-where-query-with-or
        filter.$or = [{name: keyword}, {description:keyword}]
        //filter.page = page;
        Product.find(filter)
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .populate('category_id')
        .populate('author').populate('tags').populate('imageNumber').exec((err, posts) => {
            Product.find(filter).countDocuments().exec(function(err, count) {
                res.send({
                    posts: posts,
                    current: page,
                    pages: Math.ceil(count / perPage),
                    count:count,
                })
            })
        });
    }else{
        Product.populate('author').populate('tags').exec((err, post) => {
            res.send(post)
        });
    }
};
productController.getAlls = function(req, res, next) {
    Product.find({}).exec((err, post) => {
        res.send(post)
    });
};
productController.getAll = function(req, res, next) {
    const filter = {};
    const query = url.parse(req.url,true).query;
    if(query.author){
        filter.author = query.author;
    }
    Product.find(filter).populate('author').populate('tags').exec((err, post) => {
        res.send(post)
    })
}
productController.show =async function(req, res) {
    
    const postId = await req.params.id;
    const data = await Product.findById(postId).populate('category_id').populate('author').populate('tags').populate('imageNumber').populate({path:'comments.author', select:'email'})
    const listStyle = await Styleproduct.find({_id: {$in: data.arr_style_ids}})
    const itemSupplier = await Supplierproduct.findOne({_id: data.supplier_id})
    res.send({data:data,listStyle:listStyle,itemSupplier:itemSupplier})
}
productController.create = function(req, res) {
    res.send({message:'View tạo tài khoản'})
};
//Add record
productController.store = function(req, res) {
    var datas = {
        "name": req.body.name,
        "alias": slugify(req.body.name,'-'),
        "imagePath": req.body.imagePath,
        "description": req.body.description,
        "detail": req.body.detail,
        "price": req.body.price,
        "author": req.body.author,
    };
    var post = new Product(datas);
        post.save(function(err, newPost){
            res.send(newPost)
        });
}
productController.update = function(req, res) {
    var messenger = {};
    var data = {
        name: req.body.name,
        description: req.body.description,
    }
    Product.findOne({'_id': req.params.id}, function(err, result){
        if(result){
            Product.findByIdAndUpdate(req.params.id, { $set: data}, { new: true }, function (err, results) {
                res.send(results);
            });
        }else{
            res.json({"message": "Lỗi chưa thể cập nhật sản phẩm"});
        }
    });
}
productController.delete = (req, res) => {
    Product.remove({_id: req.params.id}, function(err) {
      res.json({ "message": "Xóa sản phẩm thành công!" })
    });
}
// Thêm sản phẩm
productController.saveProductAndTag = (req, res, next) => {
    const request = req.body
    const datatags = request.tags.map(function(item, index){
        return { label: item };  // this is loop and prepare tags array to save,
    })
    //res.send(datatags)
    Tag.insertMany(datatags, {ordered:false}, function(err, savedtags){
        if(err){
            if(err.code=="11000"){  // 11000 is duplicate error code
                Tag.find({ "label": { "$in" : request.tags }}).then(function(data){
                    const post = new Product(request)
                    post.tags = data.map(function(item){
                        return item._id
                    })
                    post.arr_style_ids = request.styles_id
                    post.alias = slugify(req.body.name,'-')
                    post.save(async (err, savedpost) => {
                        if(err){
                            res.send(err)
                        }else{
                            //Thêm loại sản phẩm
                            let datastyle
                            for(i=0; i < savedpost.arr_style_ids.length; i++){
                                let itemStyle = await Styleproduct.findOne({_id: savedpost.arr_style_ids[i]})
                                itemStyle.arr_product_ids[itemStyle.arr_product_ids.length] = await savedpost._id
                                datastyle = await Styleproduct.findByIdAndUpdate(itemStyle._id, { $set: {arr_product_ids:itemStyle.arr_product_ids}}, { new: true })
                            }
                            //Thêm danh mục sản phẩm
                            let category_id = await savedpost.category_id
                            let data_category = await Catproduct.findOne({_id:category_id})
                            data_category.arr_id_product[data_category.arr_id_product.length] = savedpost._id
                            let data_post_category = await Catproduct.findByIdAndUpdate(category_id, { $set: {arr_id_product:data_category.arr_id_product}}, { new: true })
                            if(data_category.parent_id!=null){
                                var paths = await postdataparentid(data_category,savedpost._id)+'/'+data_category.alias+'/'+savedpost.alias
                            }
                            let data_post_product = await Product.findByIdAndUpdate(savedpost._id, { $set: {slug:paths}}, { new: true })
                            if(data_post_product){
                                let data_alias = await {
                                    "name": data_post_product.name,
                                    "title": data_post_product.name,
                                    "path": paths,
                                    "alias": data_post_product.alias,
                                    "slug": paths,
                                    "name_table": "product",
                                    "id_table": data_post_product._id,
                                }
                                var postalias = await new Alias(data_alias)
                                var datapostalias = await postalias.save()
                            }
                            res.send(data_post_product)
                        }
                    })
                })
            }else{
                res.send(err)
            }
        }else{
            const product = new Product(request)
            product.tags = savedtags.map(function(item, index){
                return item._id
            })
            product.arr_style_ids = request.styles_id
            product.save(async (err, savedpost) => {
                if(err){
                    res.send(err)
                }else{
                    //Thêm loại sản phẩm
                    let datastyle
                    for(i=0; i < savedpost.arr_style_ids.length; i++){
                        let itemStyle = await Styleproduct.findOne({_id: savedpost.arr_style_ids[i]})
                        //res.send(itemStyle);
                        itemStyle.arr_product_ids[itemStyle.arr_product_ids.length] = await savedpost._id
                        datastyle = await Styleproduct.findByIdAndUpdate(itemStyle._id, { $set: {arr_product_ids:itemStyle.arr_product_ids}}, { new: true })
                    }
                    //Thêm danh mục sản phẩm
                    let category_id = await savedpost.category_id
                    let data_category = await Catproduct.findOne({_id:category_id})
                    data_category.arr_id_product[data_category.arr_id_product.length] = savedpost._id

                    let data_post_category = await Catproduct.findByIdAndUpdate(category_id, { $set: {arr_id_product:data_category.arr_id_product}}, { new: true })

                    if(data_category.parent_id!=null){
                        var paths = await postdataparentid(data_category,savedpost._id)+'/'+data_category.alias+'/'+savedpost.alias
                    }
                    let data_post_product = await Catproduct.findByIdAndUpdate(savedpost._id, { $set: {slug:paths}}, { new: true })
                    if(data_post_product){
                        let data_alias = await {
                            "name": data_post_product.name,
                            "title": data_post_product.name,
                            "path": paths,
                            "alias": data_post_product.alias,
                            "slug": paths,
                            "name_table": "product",
                            "id_table": data_post_product._id,
                        }
                        var postalias = await new Alias(data_alias)
                        var datapostalias = await postalias.save()
                    }
                    res.send(data_post_product)

                }
            })
        }
    })
}
async function postdataparentid(data_category,id){
    let ids = id
    let category_id = await data_category.parent_id
    let data_categorys = await Catproduct.findById(data_category.parent_id)
    data_categorys.arr_id_product[data_categorys.arr_id_product.length] = ids
    let data_category_update = await Catproduct.findByIdAndUpdate(category_id, { $set: {arr_id_product:data_category.arr_id_product}}, { new: true })
    if(data_category_update.parent_id!=null){
        return await postdataparentid(data_category_update,ids)+'/'+data_category_update.alias
    }
    return data_category_update.alias
    
}
productController.getAlltags = function(req, res, next){
    Tag.aggregate([
        { "$project": {
            "value": "$_id",
            "label": "$label",
        }}
    ], function(err, tags) {
        if (err)
            res.send(err)
        else if (!tags)
            res.send(404)
        else
            res.send(tags)
    })
}
productController.saveProductAndTagAsync = async function(req, res, next){
    var request = req.body
    var datatags = await request.tags.map(function(item){
        return { label: item }
    })
    var savedtags = await Tag.insertMany(datatags, {ordered:false})
    res.send({savedtags:savedtags})
    
}
productController.saveProductAndTagAsyncs = async function(req, res, next){
    const request = req.body
    let returnres
    if(request._id){
        const post = await Product.findById(request._id)
        //Thêm loại sản phẩm
        let datastyle
        for(i=0; i < savedpost.arr_style_ids.length; i++){
            let itemStyle = await Styleproduct.findOne({_id: savedpost.arr_style_ids[i]})
            itemStyle.arr_product_ids[itemStyle.arr_product_ids.length] = await savedpost._id
            datastyle = await Styleproduct.findByIdAndUpdate(itemStyle._id, { $set: {arr_product_ids:itemStyle.arr_product_ids}}, { new: true })
        }
        returnres = await post.savePostTags(request)
    }else{
        const post = new Product()
        returnres = await post.savePostTags(request)
    }
    res.send(returnres)
}
productController.remove = function(req, res){
    const request = req.body
    Product.findByIdAndRemove(request._id, (err, post) => {
        if(err){
            res.send(err)
        }else{
            res.send({post: post, message:'deleted'})
        }
    })
}
module.exports = productController