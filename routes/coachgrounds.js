const express = require('express');
const router = express.Router();
const wrapAsync = require('../utilities/wrapAsync.js')
const CoachGround = require('../models/coachground.js')
const {isLoggedIn, isAuthor, validateCoachground} = require('../middleware.js')

router.get('/', async(req,res)=>{
    const coachgrounds = await CoachGround.find({})
    res.render('coachgrounds/index', {coachgrounds})
})


router.get('/new', isLoggedIn, (req,res)=>{
    res.render('coachgrounds/new');
})

router.post('/', isLoggedIn, validateCoachground, wrapAsync(async(req,res, next)=>{
    //if(!req.body.coachground){
      //  throw new ExpressError('Invalid Data', 400);
    const coachground = new CoachGround(req.body.coachground);
    coachground.author = req.user._id;
    await coachground.save();
    req.flash('success', 'Sucessfully added!')
    res.redirect(`/coachgrounds/${coachground._id}`);
    }))

router.get('/:id', wrapAsync(async (req,res, next)=>{
    const {id} = req.params;
    const coachground = await CoachGround.findById(id)
    .populate({
        path:'reviews',
        populate:{
            path:'author'
        }
    })
    .populate('author').exec();
    //console.log(coachground);
    if(!coachground){
        req.flash('error', 'Cannot find it :(');
        return res.redirect('/coachgrounds');
    }
    res.render('coachgrounds/show', {coachground})
}))

router.get('/:id/edit', isLoggedIn, isAuthor, wrapAsync(async (req,res)=>{
    const {id} = req.params;
    const coachground = await CoachGround.findById(id);
    if(!coachground){
        req.flash('error', "Cannot find it :(");
        return res.redirect('/coachgrounds');
    }
    res.render('coachgrounds/edit', {coachground})
}))

router.put('/:id', validateCoachground, isLoggedIn, isAuthor, wrapAsync(async (req,res)=>{
    const {id} = req.params;
    // added the isAuthor middleware --> const coachground = await CoachGround.findById(id)
    const coachground = await CoachGround.findByIdAndUpdate(id, {...req.body.coachground});
    req.flash('success', 'Successfully Updated!')
    res.redirect(`/coachgrounds/${coachground._id}`);
}
));

router.delete('/:id', isLoggedIn, isAuthor, wrapAsync(async(req,res)=>{
    const {id} = req.params;
    await CoachGround.findByIdAndDelete(id);
    req.flash('success', 'Successfully Deleted!!')
    res.redirect('/coachgrounds')
}))

module.exports = router;