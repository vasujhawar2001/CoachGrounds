const User = require('../models/user.js')
const express = require('express');
const router = express.Router();
const wrapAsync = require('../utilities/wrapAsync')
const passport = require('passport');
const LocalStrategy = require('passport-local')

router.get('/register', (req,res)=>{
    res.render('auth/register');
});

router.post('/register', wrapAsync(async(req,res)=>{
    try{
    //res.send(req.body);
    const {username, email, password} = req.body;
    const user = new User({email,username});
    const registeredUser = await User.register(user,password);
    //console.log(registeredUser);
    req.login(registeredUser, err => {
        if(err)
            return next(err);
        else{
            req.flash('success',`Welcome! ${username.charAt(0).toUpperCase()+username.slice(1)}`)
            res.redirect('/coachgrounds');
        }
    });
    } catch(e){
        req.flash('error', e.message);
        res.redirect('/register')
    }
}));

router.get('/login', (req,res)=>{
    res.render('auth/login')
});

router.post('/login', passport.authenticate('local', {failureFlash:true, failureRedirect:'/login', failureMessage: true, keepSessionInfo: true,}), async(req,res)=>{
    const {username} = req.body;
    req.flash('success', `Welcome! ${username.charAt(0).toUpperCase()+username.slice(1)}`);
    const redirectUrl = req.session.returnTo || '/coachgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
});

router.get('/logout', (req,res) => {
    req.logout(err => {
        if(err)
            return next(err);
        else{
            req.flash('success', 'Come Back Soon... :(');
            res.redirect('/coachgrounds');
        }})
})

module.exports = router;