const express = require('express');
const slugify = require('slugify');
slugify.extend({'đ': 'd'})
const Menu = require("../../models/menu");
const url = require('url');
const menuController = {};
menuController.list = function(req, res, next) {
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
        Menu.find(filter)
        .populate('parent_id')
        .populate('imageNumber')
        .skip((perPage * page) - perPage)
        .limit(perPage).exec((err, posts) => {
            Menu.find(filter).countDocuments().exec(function(err, count) {
                res.send({
                    posts: posts,
                    current: page,
                    pages: Math.ceil(count / perPage),
                    count:count,
                })
            })
        });
    }else{
        Menu.find({}).exec((err, post) => {
            res.send(post)
        });
    }
};
menuController.getAll = function(req, res, next) {
    const filter = {};
    const query = url.parse(req.url,true).query;
    if(query.author){
        filter.author = query.author;
    }
    Menu.find(filter).exec((err, post) => {
        res.send(post)
    });
};
menuController.show = function(req, res) {
    const postId = req.params.id;
    Menu.findById(postId).exec(function (err, admins) {
      res.send(admins);
    });
}

menuController.store = function(req, res) {
    
    var datas = {
        "name": req.body.name,
        "description": req.body.description,
        "imageNumber": req.body.imageNumber,
        "imagePath": req.body.imagePath,
        "parent_id": req.body.parent_id,
    }
    var post = new Menu(datas);
        post.save(function(err, newPost){
            if(newPost.parent_id!=null){
                res.send(newPost.parent_id);
                Menu.findOne({'_id': newPost.parent_id}, function(err, result){
                    if(result){
                        var datas1 = result.children.push(newPost.parent_id)
                        Menu.findByIdAndUpdate(result._id, { $set: datas1}, { new: true }, function (err, results) {
                            res.send(results);
                        });
                    }else{
                        res.json({"message": "Lỗi chưa thể cập nhật sản phẩm"});
                    }
                });
            }else{
                res.send(newPost)
            }
            
        });
}

menuController.update = (req, res) => {
    var data = {
        "name": req.body.name,
        "description": req.body.description,
        "parent_id": req.body.parent_id,
        "imageNumber": req.body.imageNumber,
        "imagePath": req.body.imagePath,
    }
    Menu.findOne({'_id': req.params.id}, function(err, result){
        if(result){
            Menu.findByIdAndUpdate(req.params.id, { $set: data}, { new: true }, function (err, results) {
                res.send(results);
            });
        }else{
            res.json({"message": "Lỗi chưa thể cập nhật sản phẩm"});
        }
    });
}

menuController.delete = function(req, res) {
    Menu.remove({_id: req.params.id}, function(err) {
      res.json({ "message": "Xóa sản phẩm thành công!" })
    });
};
menuController.remove = function(req, res){
    const request = req.body;
    Menu.findByIdAndRemove(request._id, (err, post) => {
        if(err){
            res.send(err);
        }else{
            res.send({post: post, message:'deleted'});
        }
    });
}
module.exports = menuController;