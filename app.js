const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const pe = require('pretty-error').start();
const chalk = require('chalk');
const packagejson = require('./package.json');

require('dotenv').config();

// Print some information
const { SERVER_URL } = process.env;
const SERVER_VERSION = packagejson.version;

console.log(`Version: ${SERVER_VERSION}\n`);

if (SERVER_URL) {
  console.log(chalk.greenBright.bold(`Listening on ${SERVER_URL}\n`));
} else {
  console.log(chalk.yellow('Warning: Server URL not set in environment variables!'));
}

// Load routes
const indexRouter = require('./routes/index');
const spotifyRouter = require('./routes/spotify');
const discordRouter = require('./routes/discord');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/spotify/', spotifyRouter);
app.use('/discord/', discordRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');

  if (err) console.error(pe.render(err));
});

module.exports = app;
