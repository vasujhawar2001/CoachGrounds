const mongoose = require('mongoose');
const CoachGround = require('../models/coachground.js')
const cities= require('./cities')
const {descriptors, places} = require('./seedHelpers')

mongoose.set('strictQuery', false);
mongoose.connect('mongodb://localhost:27017/coach-ground', {useNewUrlParser: true, useUnifiedTopology: true});
const Schema = mongoose.Schema;

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log('Database Conncected!')
});

const sample = array => array[Math.floor(Math.random()* array.length)]

const seedDB = async()=>{
    await CoachGround.deleteMany({});
    for(let i=0; i<40;i++){
    const random200 = Math.floor(Math.random()*200)
    const ground = new CoachGround({
        location: `${cities[random200].city}, ${cities[random200].state}`,
        title: `${sample(descriptors)} ${sample(places)}`
     })   
     await ground.save();
    }
}
seedDB().then(()=>{
    db.close();
}); 