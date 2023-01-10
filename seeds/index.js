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
    const random200 = Math.floor(Math.random()*200);
    const price = (Math.random()*20+10).toFixed(2);
    const ground = new CoachGround({
        author: '63bbd710127df890964ad2ba',
        location: `${cities[random200].city}, ${cities[random200].state}`,
        title: `${sample(descriptors)} ${sample(places)}`,
        image: 'https://source.unsplash.com/random',
        description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Earum obcaecati commodi dolorem voluptatum minus explicabo unde harum labore dignissimos adipisci. Quia consectetur laudantium velit excepturi assumenda dolorem sapiente voluptatum optio. Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem corporis vitae cum perferendis nisi voluptates magni ab animi rerum quaerat temporibus sit commodi ullam beatae tempora necessitatibus esse, officiis distinctio.',
        price: price
     })   
     await ground.save();
    }
}
seedDB().then(()=>{
    db.close();
}); 