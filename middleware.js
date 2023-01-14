const {coachgroundSchema, reviewSchema} = require('./schemas.js')
const ExpressError = require('./utilities/ExpressError')
const CoachGround = require('./models/coachground.js')
const Review = require('./models/review.js')

const isLoggedIn = (req, res, next) => {
    
    if(!req.isAuthenticated()){
        //check the url they are requesting
        //console(req.path,req.originalUrl)
        //req.session.returnTo = req.originalUrl --> added the return to feature to the app.js middleware
        req.flash('error', 'PLease Sign In first.');
        return res.redirect('/login');
    }
    next();
}

const validateCoachground = (req,res,next) => {
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
   
   const isAuthor = async(req,res, next)=>{
       const {id} = req.params;
       const coachground = await CoachGround.findById(id)
       if(!coachground.author.equals(req.user._id)){
           req.flash('error', 'You do not have permission to do that! :-(')
           return res.redirect(`/coachgrounds/${coachground._id}`);
       }
       next();
   }

   const validateReview = (req,res,next) =>{
    const {id} = req.params;
    const {error} = reviewSchema.validate(req.body);
    if(error){
        if(req.body.review.rating < 1){
            req.flash('error', 'Please give a rating.')
            return res.redirect(`/coachgrounds/${id}`);
        }
    }
    else{
        next();
    }
}

const isReviewAuthor = async(req,res, next)=>{
    const {id, reviewId} = req.params;
    const review = await Review.findById(reviewId)
    if(!review.author.equals(req.user._id)){
        req.flash('error', 'You do not have permission to do that! :-(')
        return res.redirect(`/coachgrounds/${id}`);
    }
    next();
}

module.exports = {
    isLoggedIn,
    validateCoachground,
    isAuthor,
    validateReview,
    isReviewAuthor
}
