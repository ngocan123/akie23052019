const express = require('express');
var http = require('http');
const slugify = require('slugify');
slugify.extend({'đ': 'd'})
const Menu = require("../../models/menu");
const Promise = require("promise");
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
        })
    }else{
        Menu.find({}).exec((err, post) => {
            res.send(post)
        });
    }
}

menuController.getAlls = function(req, res, next) {
    const filter = {};
    Menu.find({}).populate('parent_id').exec((err, post) => {
        res.send(post)
    })
}

function menu_promise(menu) {
    return new Promise((resolve, reject) => {
        resolve(menu)
    });
}
async function itemmenu(menuItem){
    let menus = await Menu.find({_id:{$in:menuItem.childs}})
    return menus
}
async function loopmenu(menu){
    if(menu[0]){
        menu[0].children = await Menu.find({_id:{$in:menu[0].childs}})
        loopmenu(menu[0].children)
    }
    if(menu[1]){
        menu[1].children = await Menu.find({_id:{$in:menu[1].childs}})
        loopmenu(menu[1].children)
    }
    if(menu[2]){
        menu[2].children = await Menu.find({_id:{$in:menu[2].childs}})
        loopmenu(menu[2].children)
    }
    if(menu[3]){
        menu[3].children = await Menu.find({_id:{$in:menu[2].childs}})
        loopmenu(menu[3].children)
    }
    if(menu[4]){
        menu[4].children = await Menu.find({_id:{$in:menu[4].childs}})
        loopmenu(menu[4].children)
    }
    if(menu[5]){
        menu[5].children = await Menu.find({_id:{$in:menu[5].childs}})
        loopmenu(menu[5].children)
    }
    if(menu[6]){
        menu[6].children = await Menu.find({_id:{$in:menu[6].childs}})
        loopmenu(menu[6].children)
    }
    if(menu[7]){
        menu[7].children = await Menu.find({_id:{$in:menu[7].childs}})
        loopmenu(menu[7].children)
    }
    if(menu[8]){
        menu[8].children = await Menu.find({_id:{$in:menu[8].childs}})
        loopmenu(menu[8].children)
    }
    if(menu[9]){
        menu[9].children = await Menu.find({_id:{$in:menu[9].childs}})
        loopmenu(menu[9].children)
    }
    if(menu[10]){
        menu[10].children = await Menu.find({_id:{$in:menu[10].childs}})
        loopmenu(menu[10].children)
    }
    if(menu[11]){
        menu[11].children = await Menu.find({_id:{$in:menu[11].childs}})
        loopmenu(menu[11].children)
    }
    
}
menuController.getAll = async function(req, res, next) {
    let menu = await Menu.find({parent_id: null});
    if(menu[0]){
        menu[0].children = await Menu.find({_id:{$in:menu[0].childs}})
        loopmenu(menu[0].children)
    }
    if(menu[1]){
        menu[1].children = await Menu.find({_id:{$in:menu[1].childs}})
        loopmenu(menu[1].children)
    }
    if(menu[2]){
        menu[2].children = await Menu.find({_id:{$in:menu[2].childs}})
        loopmenu(menu[2].children)
    }
    if(menu[3]){
        menu[3].children = await Menu.find({_id:{$in:menu[2].childs}})
        loopmenu(menu[3].children)
    }
    if(menu[4]){
        menu[4].children = await Menu.find({_id:{$in:menu[4].childs}})
        loopmenu(menu[4].children)
    }
    if(menu[5]){
        menu[5].children = await Menu.find({_id:{$in:menu[5].childs}})
        loopmenu(menu[5].children)
    }
    if(menu[6]){
        menu[6].children = await Menu.find({_id:{$in:menu[6].childs}})
        loopmenu(menu[6].children)
    }
    if(menu[7]){
        menu[7].children = await Menu.find({_id:{$in:menu[7].childs}})
        loopmenu(menu[7].children)
    }
    if(menu[8]){
        menu[8].children = await Menu.find({_id:{$in:menu[8].childs}})
        loopmenu(menu[8].children)
    }
    if(menu[9]){
        menu[9].children = await Menu.find({_id:{$in:menu[9].childs}})
        loopmenu(menu[9].children)
    }
    if(menu[10]){
        menu[10].children = await Menu.find({_id:{$in:menu[10].childs}})
        loopmenu(menu[10].children)
    }
    if(menu[11]){
        menu[11].children = await Menu.find({_id:{$in:menu[11].childs}})
        loopmenu(menu[11].children)
    }
    res.send(menu)
}
menuController.listmenu = async function(req, res, next) {
    const filter = {};
    let menu = await Menu.find({parent_id: null});
    await loopmenu(menu);
    res.send(menu);
}

menuController.show = function(req, res) {
    const postId = req.params.id;
    Menu.findById(postId).exec(function (err, admins) {
      res.send(admins);
    })
}

menuController.store = function(req, res) {
    
    var datas = {
        "name": req.body.name,
        "title": req.body.name,
        "description": req.body.description,
        "imageNumber": req.body.imageNumber,
        "imagePath": req.body.imagePath,
        "position_id": req.body.position_id,
        "parent_id": req.body.parent_id,
        "keyname": req.body.keyname,
    }
    var post = new Menu(datas);
        post.save(function(err, newPost){
            if(newPost.parent_id!=null){
                var idCd = newPost._id;
                Menu.findOne({'_id': newPost.parent_id}, function(err, result){
                    if(result){
                        var datas1 = {};
                        datas1.childs = result.childs
                        datas1.childs[result.childs.length] = idCd;
                        Menu.findByIdAndUpdate(result._id, { $set: datas1}, { new: true }, function (err, results) {
                            res.send(results);
                        })
                    }else{
                        res.json({"message": "Lỗi chưa thể cập nhật sản phẩm"});
                    }
                });
            }else{
                res.send(newPost)
            }
        })
}

menuController.update = (req, res) => {
    var data = {
        "name": req.body.name,
        "description": req.body.description,
        "parent_id": req.body.parent_id,
        "position_id": req.body.position_id,
        "keyname": req.body.keyname,
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

menuController.delete = async function(req, res) {
    const request = req.body;
    Menu.findByIdAndRemove(results._id, (err, post) => {
        if(err){
            res.send(err);
        }else{
            res.send({post: post, message:'deleted'});
        }
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
