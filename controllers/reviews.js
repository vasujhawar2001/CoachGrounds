const CoachGround = require('../models/coachground.js')
const Review = require('../models/review.js')

module.exports.createReview = async(req,res)=>{
    const coachground = await CoachGround.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    coachground.reviews.push(review);
    await review.save();
    await coachground.save();
    req.flash('success', 'Thank You for the feedback.')
    res.redirect(`/coachgrounds/${coachground._id}`);

}

module.exports.deleteReview = async(req,res)=>{
    const {id, reviewId} = req.params;
    await CoachGround.findByIdAndUpdate(id, {$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', '.... Gone!')
    res.redirect(`/coachgrounds/${id}`);
}