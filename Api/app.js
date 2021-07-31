var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongdb = require('./database/mongodb');
var cors = require('cors')

var mongoose = require('mongoose');
require('./models/settings');
require('./models/users');
require('./models/hashtags');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var whatsappRouter = require('./routes/whatsapp');
var hashtagsRouter = require('./routes/hashtags');
var accountRouter = require('./routes/account');


var verifyToken = require('./utils/jwt');

var adRouter = require('./routes/ads');

var app = express();


app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'uploads')));
app.all('*', verifyToken);

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/whatsapp', whatsappRouter);
app.use('/ads', adRouter);
app.use('/hashtags', hashtagsRouter);
app.use('/account', accountRouter);







/*
XYexcz_3-@WqP/D*/

module.exports = app;
