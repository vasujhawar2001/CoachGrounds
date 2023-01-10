const express = require('express');
const router = express.Router({mergeParams:true});
const wrapAsync = require('../utilities/wrapAsync.js')
const CoachGround = require('../models/coachground.js')
const Review = require('../models/review')
const {validateReview, isLoggedIn, isAuthor, isReviewAuthor} = require('../middleware.js')

router.post('/', isLoggedIn, validateReview, wrapAsync(async(req,res)=>{
    const coachground = await CoachGround.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    coachground.reviews.push(review);
    await review.save();
    await coachground.save();
    req.flash('success', 'Thank You for the feedback.')
    res.redirect(`/coachgrounds/${coachground._id}`);

}))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, wrapAsync(async(req,res)=>{
    const {id, reviewId} = req.params;
    await CoachGround.findByIdAndUpdate(id, {$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', '.... Gone!')
    res.redirect(`/coachgrounds/${id}`);
}))

module.exports = router;