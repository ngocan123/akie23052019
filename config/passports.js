var passport = require('passport');
var Admin = require('../models/admin');
var LocalStrategy = require('passport-local').Strategy;
passport.serializeUser(function(user, done){
    done(null, user.id);
});
passport.deserializeUser(function(id, done){
    Admin.findById(id, function(err, user){
        done(err, user);
    })
});
passport.use('local.adminAdd', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, email, password, done){
    req.checkBody('email', 'Không phải định dạng Email!').notEmpty().isEmail();
    req.checkBody('password', 'Mật khẩu không nhỏ hơn 6 ký tự').notEmpty().isLength({min:6});
    //var errors = validationErrors();
    var errors = req.validationErrors();
    if(errors){
        var messages = [];
        errors.forEach(function(error){
            messages.push(error.msg);
        });
        return done(null, false, req.flash('error', messages));
    }
    Admin.findOne({'email': email}, function(err, admin){
        if(err){
            return done(err);
        }
        if(admin){
            return done(null, false, {message: 'Email đã được sử dụng!'});
        }
        var newAdmin = new Admin();
        newAdmin.email = email;
        newAdmin.password = newAdmin.encryptPassword(password);
        newAdmin.save(function(err, result){
            if(err){
                return done(null, newAdmin);
            }
            return done(null, newAdmin);
        });
    })
}));
passport.use('local.adminLogin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, email, password, done){
    req.checkBody('email', 'Không phải định dạng Email!').notEmpty().isEmail(),
    req.checkBody('password', 'Mật khẩu không đúng').notEmpty();
    var errors = req.validationErrors();
    if(errors){
        var messages = [];
        errors.forEach(function(error){
            messages.push(error.msg);
        });
        return done(null, false, req.flash('error', messages));
    }
    Admin.findOne({ 'email': email },function(err, admin){
        if(err){
            return done(err);
        }
        if(!admin){
            return done(null, false, { message: 'Không tìm thấy email!' });
        }
        if(!admin.validPassword(password)){
            return done(null, false, { message: 'Mật khẩu không đúng!' });
        }
        return done(null, admin);
    });
}));