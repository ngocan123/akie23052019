const express = require('express');
const slugify = require('slugify');
slugify.extend({'đ': 'd'})
const Positionmenu = require("../../models/positionmenu");
const url = require('url');
const positionmenuController = {};
positionmenuController.list = function(req, res, next) {
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
        Positionmenu.find(filter)
        .skip((perPage * page) - perPage)
        .limit(perPage).exec((err, posts) => {
            Positionmenu.find(filter).countDocuments().exec(function(err, count) {
                res.send({
                    posts: posts,
                    current: page,
                    pages: Math.ceil(count / perPage),
                    count:count,
                })
            })
        });
    }else{
        Positionmenu.find({}).exec((err, post) => {
            res.send(post)
        });
    }
};
positionmenuController.getAll = function(req, res, next) {
    const filter = {};
    const query = url.parse(req.url,true).query;
    if(query.author){
        filter.author = query.author;
    }
    Positionmenu.find(filter).exec((err, post) => {
        res.send(post)
    });
};
positionmenuController.show = function(req, res) {
    const postId = req.params.id;
    Positionmenu.findById(postId).exec(function (err, admins) {
      res.send(admins);
    });
};
//Add record
positionmenuController.store = function(req, res) {
    //res.send(req);
    var datas = {
        "name": req.body.name,
        "description": req.body.description,
    };
    var post = new Positionmenu(datas);
        post.save(function(err, newPost){
            res.send(newPost)
        });
};
positionmenuController.update = (req, res) => {
    var data = {
        "name": req.body.name,
        "description": req.body.description,
    }
    Positionmenu.findOne({'_id': req.params.id}, function(err, result){
        if(result){
            Positionmenu.findByIdAndUpdate(req.params.id, { $set: data}, { new: true }, function (err, results) {
                res.send(results);
            });
        }else{
            res.json({"message": "Lỗi chưa thể cập nhật sản phẩm"});
        }
    });
}

positionmenuController.delete = function(req, res) {
    Positionmenu.remove({_id: req.params.id}, function(err) {
      res.json({ "message": "Xóa sản phẩm thành công!" })
    });
};
positionmenuController.remove = function(req, res){
    const request = req.body;
    Positionmenu.findByIdAndRemove(request._id, (err, post) => {
        if(err){
            res.send(err);
        }else{
            res.send({post: post, message:'deleted'});
        }
    });
}
module.exports = positionmenuController;