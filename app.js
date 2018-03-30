var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongojs = require('mongojs');
var db = mongojs('myfirst', ['pets']);
var MongoClient = require('mongodb').MongoClient,format = require('util').format;
MongoClient.connect('mongodb://127.0.0.1:27017', function(err,db){
    if(err){
        throw err;
    }else{
        console.log("connected");
    }
    db.close();
});

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next){
    res.locals.errors = null;
    res.locals.types_of_pet = null;
    res.locals.gender = null;
    res.locals.years_old = null;
    next();
});

app.get('/', function (req, res) {
    res.render('index.ejs');
})

app.get('/feedback', function (req, res) {
    res.render('feedback.ejs');
})

app.get('/profile', function (req, res){
    res.render('profile.ejs');
})

app.get('/search', function(req, res, data){
    db.pets.find(function (err, docs){
        console.log(docs);
        res.render('search.ejs', {
            pets: docs,
        });
    })
});

app.post('/search/pets/add', function(req, res){
    var search ={
        types_of_pet: req.body.types_of_pet,
        gender: req.body.gender,
        years_old: req.body.years_old,
    }
    db.pets.find(function (err, docs){
        console.log(docs);
        res.render('search.ejs', {
            pets: docs,
            types_of_pet: search.types_of_pet,
            gender: search.gender,
            years_old: search.years_old
        });
    })
});

app.get('/signin',function (req,res){
    res.render('signin.ejs');
})

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

/*use these data as testcases!!
var pets = [
  {
    id: 1,
    name: 'teddy',
    types_of_pet: 'dog',
    gender: 'm',
    years_old: 5
  },
  {
    id: 2,
    name: 'tommy',
    types_of_pet: 'cat',
    gender: 'm',
    years_old: 2
  },
  {
    id: 3,
    name: 'cody',
    types_of_pet: 'dog',
    gender: 'f',
    years_old: 2
  },
  {
    id: 4,
    name: 'jenny',
    types_of_pet: 'cat',
    gender: 'f',
    years_old: 7
  },
]
*/