var express = require('express');
var slugify = require('slugify');
slugify.extend({'đ': 'd'})
var Product = require("../../models/product");
var Tag = require("../../models/tag");
var productController = {};
//var router = express.Router();
//router.use(csrfProtection);
productController.list = function(req, res, next) {
    Product.find(function(err, docs){
      res.json(docs);
    });
};
productController.getAll = function(req, res, next) {
    Product.find().populate('author').exec((err, post) => {
        res.send(post)
    });
};
productController.show = function(req, res) {
    const postId = req.params.id;
    Product.findById(postId).populate('author').populate({path:'comments.author', select:'email'}).exec(function (err, admins) {
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
    //res.send(datas);
    var post = new Product(datas);
        post.save(function(err, newPost){
            res.send(newPost)
        });
};
productController.edit = function(req, res) {
    
};

productController.update = function(req, res) {
    
    var messenger = {};
    var data = {
        name: req.body.name,
        imagePath: req.body.imagePath,
        category_id: req.body.category_id,
        desciption: req.body.desciption,
        detail: req.body.detail,
        price: req.body.price,
    }
    Product.findOne({'_id': req.params.id}, function(err, result){
        if(result){
            Product.findByIdAndUpdate(req.params.id, { $set: data}, { new: true }, function (err, results) {
                res.json(results);
            });
        }else{
            res.json({"message": "Lỗi chưa thể cập nhật sản phẩm"});
        }
    });
};

productController.delete = function(req, res) {
    Product.remove({_id: req.params.id}, function(err) {
      res.json({ "message": "Xóa sản phẩm thành công!" })
    });
  };
productController.saveProductAndTag = function(req, res){
    // first save tag
    const request = req.body
    const tags = request.tags.map(function(item, index){
        return { name : item };  // this is loop and prepare tags array to save,
    })
    //res.send(tags);
    Tag.insertMany(tags, {ordered:false}, function(err, savedtags){
        //res.send(savedtags);
        if(err){ 
            if(err.code=="11000"){  // 11000 is duplicate error code
                Tag.find({ "title": { "$in" : request.tags }}).then(function(data){
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
            const post = new Product(request);
            post.tags = savedtags.map(function(item, index){
                return item._id
            })
            post.save((err, savedpost) => {
                if(err){
                    res.send(err);
                }else{
                    res.send({post: savedpost, tags:savedtags});
                }
            })
        }
    })	
}
productController.saveProductAndTagAsync = async function(req, res){
    const request = req.body;
    let returnres;
    if(request._id){
        const post = await Product.findById(request._id)
        returnres = await Product.savePostTags(request);
    }else{
        const post = new Post();		
        returnres = await post.savePostTags(request);
    }		
    res.send(returnres);
}
productController.getAlltags = function(req, res){
    Tag.aggregate([
        { "$project": {
            "value": "$_id",
            "label": "$title",
        }}
    ], function (err, tags) {
        if (err)
            res.send(err)
        else if (!tags)
            res.send(404)
        else
            res.send(tags)
        next()            
    });
}
productController.removepost = function(req, res){
    const request = req.body
    Product.findByIdAndRemove(request._id, (err, post) => {
        if(err){
            res.send(err);
        }else{
            res.send({post: post, message:'deleted'});
        }
    });
}
module.exports = productController;