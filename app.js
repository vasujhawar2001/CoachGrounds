const express = require("express");
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const CoachGround = require('./models/coachground.js')
const Review = require('./models/review')
const methodoverride = require('method-override')
const ejsMate = require('ejs-mate')
const session = require('express-session')
const flash = require('connect-flash')
const joi = require('joi')
const {coachgroundSchema, reviewSchema} = require('./schemas.js')
const wrapAsync = require('./utilities/wrapAsync.js')
const ExpressError = require('./utilities/ExpressError.js');
const passport = require('passport');
const LocalStrategy = require('passport-local')
const User = require('./models/user.js')

const userRoutes = require('./routes/users')
const coachgroundRoutes = require("./routes/coachgrounds");
const reviewsRoutes = require("./routes/reviews");


app.engine('ejs', ejsMate)

mongoose.set('strictQuery', false);
mongoose.connect('mongodb://localhost:27017/coach-ground', {useNewUrlParser: true, useUnifiedTopology: true});
const Schema = mongoose.Schema;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log('Database Conncected!')
});

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({extended:true}))
app.use(methodoverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))

const sessionConfig = {
    secret:"thisissecret",
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        expires: Date.now() + 1000*60*60*24*7,
        maxAge: 1000*60*60*24*7
    }
}
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser()) 

app.use((req,res,next)=>{
    //console.log(req.session)
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/', userRoutes)
app.use('/coachgrounds', coachgroundRoutes)
app.use('/coachgrounds/:id/reviews', reviewsRoutes)

app.get('/', (req,res)=>{
    //res.send("hello from homepage!")
    res.redirect('coachgrounds')
})

app.all('*', (req,res,next)=>{
    next(new ExpressError('Page Not Found!', 404))
})

app.use((err,req,res, next)=>{
    const {statusCode = 500} = err;
    if(!err.message) err.message ="Oh no, Something went wrong.."
    res.status(statusCode).render('error', {err});
})

app.listen(3000, ()=>
{
    console.log("checkout -> http://localhost:3000")
})

