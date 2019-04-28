const express = require('express');
const slugify = require('slugify');
slugify.extend({'đ': 'd'})
const CatProduct = require("../../models/catproduct");
const url = require('url');
const catproductController = {}
catproductController.list = function(req, res, next) {
    const filter = {};
    const query = url.parse(req.url,true).query;
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
        .limit(perPage).populate('imageNumber').exec((err, posts) => {
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
        CatProduct.populate('imageNumber').exec((err, post) => {
            res.send(post)
        });
    }
};
catproductController.getAll = function(req, res, next) {
    CatProduct.find({}).exec((err, post) => {
        res.send(post)
    });
}
catproductController.store = (req, res) => {
    var datas = {
        "name": req.body.name,
        "alias": slugify(req.body.name,'-'),
        "imagePath": req.body.imagePath,
        "imageNumber": req.body.imageNumber,
        "description": req.body.description,
        "parent_id": req.body.parent_id,
        "title_seo": req.body.title_seo,
        "description_seo": req.body.description_seo,
        "keyword_seo": req.body.keyword_seo,
    }
    var post = new CatProduct(datas);
    res.send(post);
    post.save(function(err, newPost){
        res.send(newPost)
    });
};
catproductController.show = function(req, res) {
    const postId = req.params.id;
    CatProduct.findById(postId).populate('imageNumber').populate('parent_id').exec(function (err, admins) {
      res.send(admins);
    });
}

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