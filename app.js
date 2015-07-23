var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var ejs = require('ejs');

var mongo = require('mongodb');
var mongoose = require('mongoose');
var settingsdb = mongoose.createConnection('localhost:27017/settingscollection');
var datadb = mongoose.createConnection('localhost:27017/testscollection');
var monk = require('monk');
var db = monk('localhost:27017/settingscollection');
var db2 = monk('localhost:27017/testcollection');

var routes = require('./routes/index');
var users = require('./routes/users');
var settings = require('./routes/settings');
var data = require('./routes/data');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
// app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/* All requests routed through here before being passed on. */
app.use(function(req,res,next){
    req.db = db;
    req.db2 = db2;
    req.settingsdb = settingsdb;
    req.datadb = datadb;
    next();
});

app.use('/', routes);
app.use('/users', users);
app.use('/settings', settings);
app.use('/data', data);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
