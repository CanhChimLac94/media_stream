const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors')

global.appRoot = path.resolve(__dirname);

const { routers } = require('./src/routes/index');

const app = express();

app.use(cors())

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
//-----end set view----------
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'src/public')));

routers.forEach((r) => {
    app.use(`/${r.path}`, r.router);
})
app.use(bodyParser.urlencoded({
    extended: true
}));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
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