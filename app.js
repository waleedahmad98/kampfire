var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var userRouter = require('./routes/users');
var postRouter = require('./routes/posts');
require('./db/db')();

const bodyParser = require('body-parser');
var cors = require('cors');
var app = express();

app.use(cors({origin: 'http://localhost:3000'}))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(process.cwd() + '/storage/sharedpictures'));
app.use('/profilePictures', express.static(process.cwd() + '/storage/profilepictures'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api', indexRouter);
app.use('/api/users', userRouter);
app.use('/api/posts', postRouter);


// send react build app on default path
app.use(express.static(path.join(__dirname, 'webapp/build')))
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'webapp/build/index.html'))
})

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
