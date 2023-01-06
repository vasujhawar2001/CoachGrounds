const express = require("express");
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const CoachGround = require('./models/coachground.js')
const methodoverride = require('method-override')
const ejsMate = require('ejs-mate')
const joi = require('joi')
const {coachgroundSchema} = require('./schemas.js')
const wrapAsync = require('./utilities/wrapAsync.js')
const ExpressError = require('./utilities/ExpressError.js')
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

const validateCoachground = (req,res,next) => {
       //}

    const {error} = coachgroundSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el=> el.message).join(',')
        throw new ExpressError(msg, 400)
    }
    else{
        next();
    }
    // console.log(error);
}

app.get('/', (req,res)=>{
    //res.send("hello from homepage!")
    res.render('home')
})

app.get('/coachgrounds', async(req,res)=>{
    const coachgrounds = await CoachGround.find({})
    res.render('coachgrounds/index', {coachgrounds})
})


app.get('/coachgrounds/new', (req,res)=>{
    res.render('coachgrounds/new');
})

app.post('/coachgrounds', validateCoachground, wrapAsync(async(req,res, next)=>{
    //if(!req.body.coachground){
      //  throw new ExpressError('Invalid Data', 400);
 
    const coachground = new CoachGround(req.body.coachground);
    await coachground.save();
    res.redirect(`/coachgrounds/${coachground._id}`);
    }))

app.get('/coachgrounds/:id', wrapAsync(async (req,res)=>{
    const {id} = req.params;
    const coachground = await CoachGround.findById(id)
    res.render('coachgrounds/show', {coachground})
}))

app.get('/coachgrounds/:id/edit', wrapAsync(async (req,res)=>{
    const {id} = req.params;
    const coachground = await CoachGround.findById(id)
    res.render('coachgrounds/edit', {coachground})
}))

app.put('/coachgrounds/:id', validateCoachground, wrapAsync(async (req,res)=>{
    const {id} = req.params;
    const coachground = await CoachGround.findByIdAndUpdate(id, {...req.body.coachground});
    res.redirect(`/coachgrounds/${coachground._id}`);
}
));

app.delete('/coachgrounds/:id', wrapAsync(async(req,res)=>{
    const {id} =  req.params;
    await CoachGround.findByIdAndDelete(id);
    res.redirect('/coachgrounds')
}))

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
    console.log("Listening on port 3000 localhost:3000")
})

