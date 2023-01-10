const express = require('express');
const router = express.Router();
const wrapAsync = require('../utilities/wrapAsync.js')
const ExpressError = require('../utilities/ExpressError')
const CoachGround = require('../models/coachground.js')
const {coachgroundSchema} = require('../schemas.js')
const isLoggedIn = require('../middleware.js')

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

router.get('/', async(req,res)=>{
    const coachgrounds = await CoachGround.find({})
    res.render('coachgrounds/index', {coachgrounds})
})


router.get('/new', isLoggedIn, (req,res)=>{
    res.render('coachgrounds/new');
})

router.post('/', validateCoachground, isLoggedIn, wrapAsync(async(req,res, next)=>{
    //if(!req.body.coachground){
      //  throw new ExpressError('Invalid Data', 400);
    const coachground = new CoachGround(req.body.coachground);
    await coachground.save();
    req.flash('success', 'Sucessfully added!')
    res.redirect(`/coachgrounds/${coachground._id}`);
    }))

router.get('/:id', wrapAsync(async (req,res)=>{
    const {id} = req.params;
    const coachground = await CoachGround.findById(id).populate('reviews');
    if(!coachground){
        req.flash('error', 'Cannot find it :(');
        return res.redirect('/coachgrounds');
    }
    res.render('coachgrounds/show', {coachground})
}))

router.get('/:id/edit', isLoggedIn, wrapAsync(async (req,res)=>{
    const {id} = req.params;
    const coachground = await CoachGround.findById(id);
    if(!coachground){
        req.flash('error', "Cannot find it :(");
        return res.redirect('/coachgrounds');
    }
    res.render('coachgrounds/edit', {coachground})
}))

router.put('/:id', validateCoachground, isLoggedIn, wrapAsync(async (req,res)=>{
    const {id} = req.params;
    const coachground = await CoachGround.findByIdAndUpdate(id, {...req.body.coachground});
    req.flash('success', 'Successfully Updated!')
    res.redirect(`/coachgrounds/${coachground._id}`);
}
));

router.delete('/:id', isLoggedIn, wrapAsync(async(req,res)=>{
    const {id} =  req.params;
    await CoachGround.findByIdAndDelete(id);
    req.flash('success', 'Successfully Deleted!!')
    res.redirect('/coachgrounds')
}))

module.exports = router;