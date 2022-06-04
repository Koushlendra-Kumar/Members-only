var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const dotenv = require('dotenv').config();
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const User = require('./models/user');
const compression = require('compression');
const helmet = require('helmet');

var app = express();

app.use(compression());
app.use(helmet());

const mongoDB = process.env.MONGODB_URI;

mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => console.log('connected'))
  .catch(err => console.log('err'));

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error mongodb'));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(session({ secret: 'cats', resave: false, saveUninitialized: true}));
passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne({username: username}, (err, user) => {
      if(err) {
        return done(err);
      }
      if(!user) {
        return done(null, false, {message: 'Incorrect username'});
      }
      bcrypt.compare(password, user.password, (err, res) => {
        if(res) {
          return done(null, user)
        }else {
          return done(null , false, {message: 'Incorrect password'})
        }
      });
    });
  })
);
passport.serializeUser(function(user, done) {
  done(null, user.id);
});
passport.deserializeUser(function (id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});
app.use(passport.initialize());
app.use(passport.session());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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
