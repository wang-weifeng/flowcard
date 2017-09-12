global.host = 'http://101.37.160.210:8000/';
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var backstage = require('./routes/backstage');
var pay = require('./routes/pay');
var alipayconfig = require('./payment-modules/alipay_config');
var wxpayconfig = require('./payment-modules/wxpay_config');

var cacheconfig=require('./cacheconfig.json')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    secret: '12345',
    name: 'testapp',   //这里的name值得是cookie的name，默认cookie的name是：connect.sid
    cookie: { maxAge: 1000*60*60*24*30 },  //设置maxAge是80000ms，即80s后session和相应的cookie失效过期
    resave: true,
    saveUninitialized: true,
}));
app.use(function (req, res, next) {
    var url = req.path
    var arr = url.split('.');
    var len = arr.length;
    var append = arr[len - 1]
    if (append == url) append == ''
  
    if (!cacheconfig[append]) {
      res.setHeader('Cache-Control', 'public,max-age=' + cacheconfig['default']);
    }
    else {
      res.setHeader('Cache-Control', 'public,max-age=' + cacheconfig[append]);
    }
    next();
  });
app.use(express.static(path.join(__dirname, 'public')));
app.use(require('./util/trace'));
app.use(require('./config/localsExtend'));
app.use('/', index);
app.use('/users', users);
app.use('/backstage', backstage);
app.use('/pay', pay);


  
//app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 }}))
alipayconfig.alipay.route(app);
wxpayconfig.wxpay.route(app);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
