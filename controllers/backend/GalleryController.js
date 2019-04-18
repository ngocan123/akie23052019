const express = require('express');
const app = express();
const fs = require('fs');
const Gallery = require("../../models/gallery");
//========Fix upload image
var multer = require('multer');
var cors = require('cors');
app.use(cors());
const galleryController = {};
//Hiển thị modal Gallery
galleryController.showModalGallery = function(req, res, next) {
  //const query = url.parse(req.url,true).query;
  // const result = {
  //   title: 'hk'
  // };
  res.render('backend/managerGallery/modalGallery',{ result: 'ok'});
};
//Add record
galleryController.getAll = function(req, res, next) {
  Gallery.find().exec((err, post) => {
      res.send(post)
  });
};
galleryController.show = function(req, res) {
  // const postId = req.params.id;
  // Product.find(postId).then((err, result) => {
  //   res.send(result);
  // });
  const postId = req.params.id;
    Gallery.findById(postId).exec(function (err, admins) {
      res.send(admins);
    });
};
galleryController.store = function(req, res) {
  //fs.mkdirSync('public/uploads/product');
  //res.send(fd);
  //res.send('ok');
  var data = {
    title: '',
    path: '',
    size: '',
    filename: '',
    destination: '',
  }
  var storage = multer.diskStorage({
    destination: function (req, file, cb) {
    cb(null, 'public/uploads/products')
  },
  filename: function (req, file, cb) {
      cb(null, Date.now() + '-' +file.originalname )
  }
  })
  var upload = multer({ storage: storage }).single('file');
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
        return res.status(500).json(err)
    } else if (err) {
        return res.status(500).json(err)
    }
    datas = {
      "title": '',
      "path": req.file.path.replace('public', ''),
      "size": req.file.size,
      "filename": req.file.filename,
      "destination": req.file.destination,
    }
  //res.send(datas);
  var newPost = new Gallery(datas);
      newPost.save(function(err, results){
          res.send(results);
      });
    //return res.status(200).send(req.file);
  })
};
galleryController.update = function(req, res) {
    var messenger = {};
    var data = {
        name: req.body.name,
        description: req.body.description,
    }
    Gallery.findOne({'_id': req.params.id}, function(err, result){
        if(result){
          Gallery.findByIdAndUpdate(req.params.id, { $set: data}, { new: true }, function (err, results) {
                res.send(results);
            });
        }else{
            res.json({"message": "Lỗi chưa thể cập nhật sản phẩm"});
        }
    });
};

galleryController.delete = function(req, res) {
  Gallery.remove({_id: req.params.id}, function(err) {
    res.json({ "message": "Xóa ảnh thành công!" })
  });
};
galleryController.remove = function(req, res){
  const request = req.body;
  Gallery.findByIdAndRemove(request._id, (err, post) => {
      if(err){
          res.send(err);
      }else{
          res.send({post: post, message:'deleted'});
      }
  });
}
module.exports = galleryController;