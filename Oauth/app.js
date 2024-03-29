const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const RateLimit = require('express-rate-limit');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const OAuthValidationError = require("./error/OAuthValidationError");

const app = express();

const limiter = RateLimit({
  windowMs: 60 * 1000,
  max: 60 * 1000 * 100
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(limiter);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(function (error, req, res, next) {
  if (error instanceof SyntaxError && error.type === 'entity.parse.failed') {
    res.setHeader('content-type', 'text/json');
    res.status(400);
    return res.send({
      "error_code": "400",
      "error_message": "Bad Request"
    });
  } else {
    next();
  }
});
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
