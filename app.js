if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}

//console.log(process.env.CLOUDINARY_CLOUD_NAME);

const express = require("express");
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodoverride = require('method-override')
const ejsMate = require('ejs-mate')
const session = require('express-session')
const flash = require('connect-flash')
const ExpressError = require('./utilities/ExpressError.js');
const passport = require('passport');
const LocalStrategy = require('passport-local')
const User = require('./models/user.js')

const userRoutes = require('./routes/users')
const coachgroundRoutes = require("./routes/coachgrounds");
const reviewsRoutes = require("./routes/reviews");
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet')
const MongoStore = require("connect-mongo");

app.engine('ejs', ejsMate)

const dbUrl = process.env.DB_URL;

mongoose.set('strictQuery', false);

mongoose.connect(dbUrl, {useNewUrlParser: true, useUnifiedTopology: true});  

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
//do not let include other query string from req.query ?$gt='sssdsdscvfgdh'
app.use(mongoSanitize({}));

const secret= process.env.SECRET || "thisissecret";

const sessionConfig = {
    store: MongoStore.create({
        mongoUrl: dbUrl,
        touchAfter: 24 * 3600 // time period in seconds
      }),
    name:'session',
    secret,
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        //secure:true,
        expires: Date.now() + 1000*60*60*24*7,
        maxAge: 1000*60*60*24*7
    }
}
app.use(session(sessionConfig));
app.use(flash());
//app.use(helmet());

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
//This is the array that needs added to
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net",
    "https://stackpath.bootstrapcdn.com/bootstrap/5.0.0-alpha1/css/bootstrap.min.css"
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dhld6mora/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser()) 

app.use((req,res,next)=>{
    //console.log(req.session)
    
    delete req.session.returnTo;
    if(!['/login', '/'].includes(req.originalUrl)) {
        req.session.returnTo = req.originalUrl;
    }
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
    res.render('home.ejs')
})

app.all('*', (req,res,next)=>{
    next(new ExpressError('Page Not Found!', 404))
})

app.use((err,req,res, next)=>{
    const {statusCode = 500} = err;
    if(!err.message) err.message ="Oh no, Something went wrong.."
    res.status(statusCode).render('error', {err});
})

const port = process.env.PORT || 3000;
app.listen(port, ()=>
{
    console.log(`Serving on port ${port}`)
})

