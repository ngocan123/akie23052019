var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
// these are require packages that we need

var hbs = require('express-hbs');
var passport = require('passport');
var session = require('express-session');
var flash = require('connect-flash');
var validator = require('express-validator');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var adminsRouter = require('./routes/admin/admin');
var apiUserRouter = require('./routes/api/users');
var apiProductRouter = require('./routes/api/product');
var apiCatProductRouter = require('./routes/api/catproduct');
var apiTagRouter = require('./routes/api/tag');
var apiGalleryRouter = require('./routes/api/gallery');
var apiAuthRouter = require('./routes/auth');

var app = express();
const router = express.Router()   // this is create router
// add this line because intend to accept only json para and only return json
router.use(bodyParser.urlencoded({ extended: false })); // for json return
router.use(bodyParser.json());  // for json return 
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
// right here we need to allow domain
const corsOptions = {
	origin: ['http://localhost:3000'],
	credentials:true,
}
app.use(cors(corsOptions));
app.use(bodyParser.json());

app.use(validator());
app.use(cookieParser());
app.use(session({ secret: 'supersecret', resave: false, saveUninitialized: false }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));
// app.use(function(req, res, next){
//   res.locals.login = req.isAuthenticated('local.signin');
//   next();
// });
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/admin/', adminsRouter);
app.use('/api/user', apiUserRouter);
app.use('/api/product', apiProductRouter);
app.use('/api/catproduct', apiCatProductRouter);
app.use('/api/tag', apiTagRouter);
app.use('/api/gallery', apiGalleryRouter);
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
