const express = require('express');
const router = express.Router({mergeParams:true});
const wrapAsync = require('../utilities/wrapAsync.js')
const CoachGround = require('../models/coachground.js')
const Review = require('../models/review')
const reviews = require('../controllers/reviews.js')
const {validateReview, isLoggedIn, isAuthor, isReviewAuthor} = require('../middleware.js')

router.post('/', isLoggedIn, validateReview, wrapAsync(reviews.createReview))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, wrapAsync(reviews.deleteReview))

module.exports = router;