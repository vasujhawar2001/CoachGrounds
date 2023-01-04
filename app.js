const express = require("express");
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const CoachGround = require('./models/coachground.js')
const methodoverride = require('method-override')

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

app.post('/coachgrounds', async(req,res)=>{
    const coachground = new CoachGround(req.body.coachground);
    await coachground.save();
    res.redirect(`/coachgrounds/${coachground._id}`);
})

app.get('/coachgrounds/:id', async (req,res)=>{
    const {id} = req.params;
    const coachground = await CoachGround.findById(id)
    res.render('coachgrounds/show', {coachground})
})

app.get('/coachgrounds/:id/edit', async (req,res)=>{
    const {id} = req.params;
    const coachground = await CoachGround.findById(id)
    res.render('coachgrounds/edit', {coachground})
})

app.put('/coachgrounds/:id', async (req,res)=>{
    const {id} = req.params;
    const coachground = await CoachGround.findByIdAndUpdate(id, {...req.body.coachground});
    res.redirect(`/coachgrounds/${coachground._id}`);
}
);

app.delete('/coachgrounds/:id', async(req,res)=>{
    const {id} =  req.params;
    await CoachGround.findByIdAndDelete(id);
    res.redirect('/coachgrounds')
})
app.listen(3000, ()=>
{
    console.log("Listening on port 3000 localhost:3000")
})