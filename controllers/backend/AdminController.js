var express = require('express');
var Admin = require("../../models/admin");
var adminController = {};
var router = express.Router();
//router.use(csrfProtection);
adminController.list = function(req, res, next) {
    //res.json({});
    Admin.find(function(err, docs){
      res.json(docs);
      //console.log(docs);
        //res.render('backend/admin/list', { title:"Danh sách sản phẩm", layout: 'layouts/backend/home', result: docs });
    });
};
adminController.show = function(req, res) {
    Admin.findOne({_id: req.params.id}).exec(function (err, admins) {
      if (err) {
        console.log("Error:", err);
      }
      else {
        res.render("backend/admin/show", {admins: admins, csrfToken: req.csrfToken(), layout: 'layouts/backend/home'});
      }
    });
};
adminController.create = function(req, res) {
    res.render("backend/admin/create", {title: 'Thêm tài khoản', csrfToken: req.csrfToken(), layout: 'layouts/backend/home'});
};
//Add record
adminController.save = function(req, res) {
    Admin.findOne({'email': req.body.email}, function(err, admin){
        if(err){
            return done(err);
        }
        if(admin){
            return done(null, false, {message: 'Email đã được sử dụng!'});
        }
        var newPost = new Admin();
        newPost.name = req.body.name;
        newPost.address = req.body.address;
        newPost.email = req.body.email;
        newPost.phone = req.body.phone;
        newPost.zalo = req.body.zalo;
        newPost.facebook = req.body.facebook;
        newPost.gplus = req.body.plus;
        newPost.website = req.body.website;
        newPost.password = newPost.encryptPassword(req.body.password);
        newPost.save(function(err, newPost){
            if(err){
                return done(null, newPost);
            }
        res.redirect('/admin/list');
        });
    });
};
adminController.edit = function(req, res) {
    Admin.findOne({_id: req.params.id}).exec(function (err, results) {
      if (err) {
        res.redirect("/admin/show/"+res._id);
      }
      else {
        res.render("backend/admin/edit", {results: results, csrfToken: req.csrfToken(), layout: 'layouts/backend/home'});
      }
    });
};

adminController.update = function(req, res) {
    
    var messenger = {};
    var data = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        zalo: req.body.zalo,
        website: req.body.website,
        facebook: req.body.facebook,
        gplus: req.body.gplus,
        address: req.body.address,
    }
    Admin.findOne({'email': req.body.email}, function(err, result){
        if(result && result._id!=req.params.id){
            res.redirect("/admin/edit/"+req.params.id);
        }else{
            Admin.findByIdAndUpdate(req.params.id, { $set: data}, { new: true }, function (err, results) {
                res.render("backend/admin/edit", {results: req.body, csrfToken: req.csrfToken(), layout: 'layouts/backend/home' });
            });
        }
    });
};

adminController.delete = function(req, res) {
    Admin.remove({_id: req.params.id}, function(err) {
      if(err) {
        res.redirect("/admin/list");
      }
      else {
        res.redirect("/admin/list");
      }
    });
  };
module.exports = adminController;