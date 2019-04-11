var createError = require('http-errors');
var express = require('express');

var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var hbs = require('express-hbs');
var passport = require('passport');
var session = require('express-session');
var flash = require('connect-flash');
var validator = require('express-validator');
var cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin/index');
var adminsRouter = require('./routes/admin/admin');
var apiUserRouter = require('./routes/api/users');
var apiProductRouter = require('./routes/api/product');
var apiAuthRouter = require('./routes/auth');
var corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
var app = express();
var uri = 'mongodb://shop2019:shop2019@cluster0-shard-00-00-uwpjt.mongodb.net:27017,cluster0-shard-00-01-uwpjt.mongodb.net:27017,cluster0-shard-00-02-uwpjt.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true';
mongoose.connect(uri, { useNewUrlParser: true });
require('./config/passport');
app.engine('hbs', hbs.express4({
  defaultLayout: 'views/layouts/layout',
  layoutsDir: __dirname + '/views', 
  partialsDir: __dirname + '/views'
}));
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(validator());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(session({ secret: 'mysupersecret', resave: false, saveUninitialized: false }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req, res, next){
  res.locals.login = req.isAuthenticated('local.signin');
  next();
});
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin', adminRouter);
app.use('/admin', adminsRouter);
app.use('/api/user', apiUserRouter);
app.use('/api/product', apiProductRouter);
app.use('/api/auth', apiAuthRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
