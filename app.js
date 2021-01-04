require('dotenv').config();

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var wsserver = require("./ws_server/ws.js")
var passport = require('passport');
var swaggerJsdoc = require('swagger-jsdoc');
var swaggerUi = require('swagger-ui-express');
const compression = require('compression');

var swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "TinyRoom",
      version: "1.0.0",
      description: "TinyRoom REST API"
    },
    license: {
      name: "GNU LGPLv3",
      url: "https://choosealicense.com/licenses/lgpl-3.0"
    },
    contact: {
      name: "Tinyroom",
      email: "tiny@room.net"
    },
    servers: [
      { url: "http://localhost:3000/api" },
      { url: "http://157.245.36.23/api" }
    ]
  },
  apis: [
    "./app_api/models/uporabniki.js",
    "./app_api/routes/index.js"
  ]
};
const swaggerDocument = swaggerJsdoc(swaggerOptions);


require('./app_api/models/db');
require('./app_api/configuration/passport');

//var indexRouter = require('./app_server/routes/index'); //usmerjevalnik, glede na zahtevo kličemo metode iz krmilnika
var indexApi = require('./app_api/routes/index');

var app = express();
//app.use(compression());

/*
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https')
      res.redirect(`https://${req.header('host')}${req.url}`);
    else
      next();
  });
}
*/

// picture upload
const fileUpload = require('express-fileupload');
app.use(fileUpload({
  createParentPath: true
}));

// view engine setup
app.set('views', path.join(__dirname, 'app_server', 'views'));
app.set('view engine', 'hbs');

require('./app_server/views/helpers/hbsh.js');

// Odprava varnostnih pomanjkljivosti
/*
app.disable('x-powered-by');
app.use((req, res, next) => {
  res.header('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  next();
});
*/

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: "abcdef",
  saveUninitialized: false,
  resave: false,
  cookie: { maxAge: 2 * 60 * 60 * 1000 }
}));
//app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'app_public', 'build')));

//Handles robots.txt
app.all('/robots.txt', (req, res) => {
  res.type('text/plain')
  res.send("User-agent: *\Allow: /");
});

app.use('/api', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
  next();
});

//app.use('/', indexRouter);
app.use('/api', indexApi);
app.get(/(\/private)|(\/profile)|(\/signin)|(\/logout)|(\/db)/, (req, res, next) => {
  res.sendFile(path.join(__dirname, 'app_public', 'build', 'index.html'));
});

indexApi.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
indexApi.get("/swagger.json", (req, res) => {
  res.status(200).json(swaggerDocument);
});

app.use(passport.initialize());


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Obvladovanje napak zaradi avtentikacije
app.use((err, req, res, next) => {
  if (err.name == "UnauthorizedError") {
    res.status(401).json({ "sporočilo": err.name + ": " + err.message });
  }
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
