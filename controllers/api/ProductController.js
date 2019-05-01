const express = require('express')
const slugify = require('slugify')
slugify.extend({'đ': 'd'})
const Product = require("../../models/product")
const Tag = require("../../models/tag")
const url = require('url')
const productController = {}
productController.list = function(req, res, next) {
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
    //res.send('okok');
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
    });
};
productController.show = function(req, res) {
    const postId = req.params.id;
    Product.findById(postId).populate('category_id').populate('author').populate('tags').populate('imageNumber').populate({path:'comments.author', select:'email'}).exec(function (err, admins) {
      res.send(admins);
    });
};
productController.create = function(req, res) {
    res.send('View tạo tài khoản');
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
};

productController.delete = (req, res) => {
    Product.remove({_id: req.params.id}, function(err) {
      res.json({ "message": "Xóa sản phẩm thành công!" })
    });
}
productController.saveProductAndTag = (req, res, next) => {
    const request = req.body
    const tags = request.tags.map(function(item, index){
        return { label : item };  // this is loop and prepare tags array to save,
    });
    Tag.insertMany(tags, {ordered:false}, function(err, savedtags){
        if(err){
            if(err.code=="11000"){  // 11000 is duplicate error code
                Tag.find({ "label": { "$in" : request.tags }}).then(function(data){
                    const post = new Product(request);
                    post.tags = data.map(function(item, index){
                        return item._id
                    })
                    post.save((err, savedpost) => {
                        if(err){
                            res.send(err);
                        }else{
                            res.send({post: savedpost, tags:data});
                        }
                    })
                })
            }else{
                res.send(err);
            }
        }else{
            const product = new Product(request);
            product.tags = savedtags.map(function(item, index){
                return item._id
            })
            product.save((err, savedpost) => {
                if(err){
                    res.send(err);
                }else{
                    res.send({post: savedpost, tags:savedtags});
                }
            })
        }
    })	
}
productController.getAlltags = function(req, res, next){
    Tag.aggregate([
        { "$project": {
            "value": "$_id",
            "label": "$label",
        }}
    ], function (err, tags) {
        if (err)
            res.send(err)
        else if (!tags)
            res.send(404)
        else
            res.send(tags)
    });
}
productController.saveProductAndTagAsync = async function(req, res, next){
    const request = req.body
    let returnres;
    if(request._id){
        const post = await Product.findById(request._id);
        returnres = await post.savePostTags(request);		
    }else{
        const post = new Product();		
        returnres = await post.savePostTags(request);
    }		
    res.send(returnres);
}
productController.remove = function(req, res){
    const request = req.body;
    Product.findByIdAndRemove(request._id, (err, post) => {
        if(err){
            res.send(err);
        }else{
            res.send({post: post, message:'deleted'});
        }
    });
}
module.exports = productController;