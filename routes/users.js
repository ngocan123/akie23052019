//require('../config/passport');
var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');
var csrfProtection = csrf();
router.use(csrfProtection);
//Quan ly thong tin khach hang
router.get('/profile', isLoggedIn, function(req, res, next){
  res.render('frontend/users/profile',{ title: 'Profile' });
});
router.get('/logout', isLoggedIn, function(req, res, next){
  req.logOut();
  res.redirect('/users/signin');
});
router.use('/', notLoggedIn, function(req, res, next){
  next();
});
/* GET users listing. */
router.get('/signup', function(req, res, next) {
  var messages = req.flash('error');
  res.render('frontend/users/signup', { title: 'Đăng ký', csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0 });
});
router.post('/signup', passport.authenticate('local.signup', {
  successRedirect: '/users/profile',
  failureRedirect: '/users/signup',
  failureFlash: true
}));
router.get('/signin', function(req, res, next){
  var messages = req.flash('error');
  res.render('frontend/users/signin', { title: 'Đăng nhập', csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0 });
});
router.post('/signin', passport.authenticate('local.signin', {
  successRedirect: '/users/profile',
  failureRedirect: '/users/signin',
  failureFlash: true
}));

module.exports = router;

function isLoggedIn(req, res, next){
  console.log(req.isAuthenticated('local.signin'));
  console.log(req.isAuthenticated('local.adminLogin'));
  if(req.isAuthenticated('local.signin')){
    return next();
  }
  res.redirect('/');
}
function notLoggedIn(req, res, next){
  if(!req.isAuthenticated('local.signin')){
    return next();
  }
  res.redirect('/');
}
