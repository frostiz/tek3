var express = require('express');
var app = express();

var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');

var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var cors = require('cors');

var configDB = require('./config/database.config');

mongoose.set('debug', true);
mongoose.connect(configDB.url, configDB.options);

require('./config/passport.config')(passport);

app.set('view engine', 'ejs');
app.set('views', __dirname + '/client/views');

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser()); //app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/client/public'));
app.use(cors());

app.use(session({secret: 'dashboard2018', resave: true, saveUnitialized: false}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require('./server/routes/router')(app, passport);

module.exports = app;
