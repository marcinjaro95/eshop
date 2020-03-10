const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');
const expressHbs = require('express-handlebars');
const helpers = require('handlebars-helpers');
const flash = require('connect-flash');


/* initialize helpers and env */
helpers();
require('dotenv').config();

/* authentication */
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const MySQLStore = require('express-mysql-session')(session);
const bcrypt = require('bcrypt');
const DatabaseModel = require('./model/DatabaseModel');

const indexRoutes = require('./routes');

const db = new DatabaseModel();

/* create database */
if (!db.isDatabaseExist()) {
  db.createDatabase();
}

const app = express();

const hbs = expressHbs.create({
  defaultLayout: 'layout',
  extname: '.hbs',
});

// view engine setup
app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser({ extended: true }));
app.use(session({ secret: 'mysupersecret', resave: false, saveUninitialized: false }));
app.use(flash());

app.use(express.static(path.join(__dirname, 'public')));
const options = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  multipleStatements: true,
};

const sessionStore = new MySQLStore(options);

app.use(session({
  secret: '87yhfj90as',
  resave: false,
  store: sessionStore,
  saveUninitialized: false,
  /* cookie: { secure: true }, */
}));
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated();
  next();
});

app.use('/about', indexRoutes);
app.use('/', indexRoutes);
app.use('/cart', indexRoutes);
app.use('/category-c-:id', indexRoutes);
app.use('/category-p-:id', indexRoutes);
app.use('/contact', indexRoutes);
app.use('/checkout', indexRoutes);
app.use('/product-p-:id', indexRoutes);
app.use('/account-edit-data', indexRoutes);
app.use('/account-edit-address-data', indexRoutes);
app.use('/account-order-history', indexRoutes);
app.use('/account-sign-in', indexRoutes);
app.use('/account-sign-up', indexRoutes);

passport.use(new LocalStrategy(
  (username, password, done) => {
    console.log('username', username);
    console.log('password', password);

    db.createQuery('SELECT user_id, password FROM users WHERE username = ?', [username], (err, results, fields) => {
      if (err) {
        done(err);
      }
      if (results.length === 0) {
        done(null, false);
      } else {
        const hash = results[0].password.toString();
        bcrypt.compare(password, hash, (err, response) => {
          if (err) throw err;
          if (response === true) {
            return done(null, { userId: results[0].user_id });
          }
          return done(null, false);
        });
      }
    });
  },
));

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
