const express = require('express');
const slugify = require('slugify');
slugify.extend({'đ': 'd'})
const CatProduct = require("../../models/catproduct");
const url = require('url');
const catproductController = {};
catproductController.list = function(req, res, next) {
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
        CatProduct.find(filter)
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .populate('author').populate('tags').populate('imageNumber').exec((err, posts) => {
            CatProduct.find(filter).countDocuments().exec(function(err, count) {
                res.send({
                    posts: posts,
                    current: page,
                    pages: Math.ceil(count / perPage),
                    count:count,
                })
            })
        });
    }else{
        CatProduct.populate('author').populate('tags').exec((err, post) => {
            res.send(post)
        });
    }
};
catproductController.getAll = function(req, res, next) {
    const filter = {};
    const query = url.parse(req.url,true).query;
    if(query.author){
        filter.author = query.author;
    }
    CatProduct.find(filter).populate('author').populate('tags').exec((err, post) => {
        res.send(post)
    });
};
catproductController.show = function(req, res) {
    const postId = req.params.id;
    CatProduct.findById(postId).populate('author').populate('tags').populate('imageNumber').populate({path:'comments.author', select:'email'}).exec(function (err, admins) {
      res.send(admins);
    });
};
catproductController.create = function(req, res) {
    res.send('View tạo tài khoản');
};
//Add record
catproductController.store = function(req, res) {
    //res.send(req);
    var datas = {
        "name": req.body.name,
        "alias": slugify(req.body.name,'-'),
        "imagePath": req.body.imagePath,
        "imageNumber": req.body.imageNumber,
        "description": req.body.description,
        "parent_id": req.body.parent_id,
        "title_seo": req.body.title_seo,
        "keyword_seo": req.body.keyword_seo,
        "description_seo": req.body.description_seo,
    };
    var post = new CatProduct(datas);
        post.save(function(err, newPost){
            res.send(newPost)
        });
};
catproductController.update = function(req, res) {
    var data = {
        name: req.body.name,
        description: req.body.description,
        parent_id: req.body.parent_id,
        imageNumber: req.body.imageNumber,
        imagePath: req.body.imagePath,
        title_seo: req.body.title_seo,
        description_seo: req.body.description_seo,
        keyword_seo: req.body.keyword_seo,
    }
    CatProduct.findOne({'_id': req.params.id}, function(err, result){
        if(result){
            CatProduct.findByIdAndUpdate(req.params.id, { $set: data}, { new: true }, function (err, results) {
                res.send(results);
            });
        }else{
            res.json({"message": "Lỗi chưa thể cập nhật sản phẩm"});
        }
    });
};

catproductController.delete = function(req, res) {
    CatProduct.remove({_id: req.params.id}, function(err) {
      res.json({ "message": "Xóa sản phẩm thành công!" })
    });
  };
catproductController.remove = function(req, res){
    const request = req.body;
    CatProduct.findByIdAndRemove(request._id, (err, post) => {
        if(err){
            res.send(err);
        }else{
            res.send({post: post, message:'deleted'});
        }
    });
}
module.exports = catproductController;