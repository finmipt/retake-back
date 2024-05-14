/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });



const path = require('path');
const express = require('express');
const session = require('express-session');
const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const jwtRouter = require('./routes/jwt')
const adminRouter = require('./routes/admin');
const eventRouter = require('./routes/event');
const registrationRouter = require('./routes/registration');
const {FRONT_END} = require("./authConfig");

// initialize express
const app = express();
const bot = require('./bot/bot');
//db connecting
const mongoDB= process.env.MONGODB_URI;
mongoose.connect( mongoDB );

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function() {
  // Сообщение о успешном подключении
  console.log("Connected to MongoDB");
});



/**
 * Using express-session middleware for persistent user session. Be sure to
 * familiarize yourself with available options. Visit: https://www.npmjs.com/package/express-session
 */
app.use(session({
  secret: process.env.EXPRESS_SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false, // set this to true on production
  }
}));
const corsOptions = {
  origin: FRONT_END, // Front_end
  credentials: true,
};

app.use(cors(corsOptions));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


//Router
app.use('/api/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);
app.use('/api/jwt', jwtRouter)
app.use('/api/admin', adminRouter);
app.use('/api/event', eventRouter);
app.use('/api/registration', registrationRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
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