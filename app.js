var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var wsserver = require("./ws_server/ws.js")

require('./app_api/models/db');

//var indexRouter = require('./app_server/routes/index'); //usmerjevalnik, glede na zahtevo kličemo metode iz krmilnika
var indexApi = require('./app_api/routes/index');

var app = express();

// picture upload
const fileUpload = require('express-fileupload');
app.use(fileUpload({
  createParentPath: true
}));

// view engine setup
app.set('views', path.join(__dirname, 'app_server', 'views'));
app.set('view engine', 'hbs');

require('./app_server/views/helpers/hbsh.js');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: "abcdef",
  saveUninitialized: false,
  resave: false,
  cookie: {maxAge : 2 * 60 * 60 * 1000}
}));
//app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'app_public', 'build')));

app.use('/api', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
  next();
});

//app.use('/', indexRouter);
app.use('/api', indexApi);
app.get(/(\/private)|(\/profile)|(\/signin)|(\/logout)/, (req, res, next) => {
  res.sendFile(path.join(__dirname, 'app_public', 'build', 'index.html'));
});


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
