const express = require('express');
const router = express.Router({mergeParams:true});
const wrapAsync = require('../utilities/wrapAsync.js')
const ExpressError = require('../utilities/ExpressError')
const CoachGround = require('../models/coachground.js')
const {reviewSchema} = require('../schemas.js')
const Review = require('../models/review')

const validateReview = (req,res,next) =>{
    const {error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el=> el.message).join(',')
        throw new ExpressError(msg, 400)
    }
    else{
        next();
    }
}

router.post('/', validateReview, wrapAsync(async(req,res)=>{
    const coachground = await CoachGround.findById(req.params.id);
    const review = new Review(req.body.review);
    coachground.reviews.push(review);
    await review.save();
    await coachground.save();
    req.flash('success', 'Thank You for the feedback.')
    res.redirect(`/coachgrounds/${coachground._id}`);

}))

router.delete('/:reviewId', wrapAsync(async(req,res)=>{
    const {id, reviewId} = req.params;
    await CoachGround.findByIdAndUpdate(id, {$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', '.... Gone!')
    res.redirect(`/coachgrounds/${id}`);
}))

module.exports = router;