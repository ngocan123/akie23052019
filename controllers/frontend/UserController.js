var express = require('express');
var bcrypt = require('bcryptjs');
var User = require("../../models/user");

var userController = {};
var router = express.Router();
//router.use(csrfProtection);
userController.list = function(req, res, next) {
    User.find(function(err, docs){
      res.json(docs);
    });
};
userController.getAll = function(req, res, next) {
    User.find({}, { password: 0 }).then((err, users) => {
        if(err)
            res.send(err)
        else if(!users)
            res.send(404)
        else
            res.send(users)
        next()
    });
};
userController.show = function(req, res) {
    var useId = req.params.id;
    User.find(useId, { password: 0 }).then((err, users) => {
        if(err)
            res.send(err)
        else if(!users)
            res.send(404)
        else
            res.send(users)
        next()
    });
};
userController.create = function(req, res) {
    res.send('View tạo tài khoản');
};
//Add record
userController.store = function(req, res) {
    User.findOne({'email': req.body.email}, function(err, user){
        
        
        var newPost = new User();
        if(req.body.password){
            var hashedPassword = bcrypt.hashSync(req.body.password, 8);	
            newPost.password = hashedPassword;			
        }
        newPost.name = req.body.name;
        newPost.email = req.body.email;
        newPost.save(function(err, newPost){
            res.send(newPost)
        });
    });
};
userController.edit = function(req, res) {
    User.findOne({_id: req.params.id}).exec(function (err, results) {
      if (err) {
        res.redirect("/admin/show/"+res._id);
      }
      else {
        res.render("backend/admin/edit", {results: results, csrfToken: req.csrfToken(), layout: 'layouts/backend/home'});
      }
    });
};

userController.update = function(req, res) {
    
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
    User.findOne({'email': req.body.email}, function(err, result){
        if(result && result._id!=req.params.id){
            res.redirect("/admin/edit/"+req.params.id);
        }else{
            Admin.findByIdAndUpdate(req.params.id, { $set: data}, { new: true }, function (err, results) {
                res.render("backend/admin/edit", {results: req.body, csrfToken: req.csrfToken(), layout: 'layouts/backend/home' });
            });
        }
    });
};

userController.delete = function(req, res) {
    User.remove({_id: req.params.id}, function(err) {
      if(err) {
        res.redirect("/admin/list");
      }
      else {
        res.redirect("/admin/list");
      }
    });
  };
module.exports = userController;