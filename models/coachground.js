const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review')

//cloudinary url
const CoachgroundSchema = new Schema({
    title:String,
    images:[
        {
            url:String,
            filename:String
        }
    ],
    geometry:{
        type:{
            type:String,   // DOnt do {geometry:{typr:String}},
            enum:['Point'], // 'geometry.type must be a point
            required:true
        },
        coordinates:{
            type:[Number],
            required:true
        }
    },
    price:Number,
    description:String,
    location:String,
    author: {
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    reviews:[
        {
            type: Schema.Types.ObjectId,
            ref:'Review'
        }
    ]
})

CoachgroundSchema.path('images').schema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload/', '/upload/w_300/');
});

CoachgroundSchema.post('findOneAndDelete', async(doc)=>{
    if(doc){
        await Review.deleteMany({
            _id:{
                $in:doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Coachground', CoachgroundSchema);