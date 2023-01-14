const User = require('../models/user.js')
const express = require('express');
const router = express.Router();
const wrapAsync = require('../utilities/wrapAsync')
const passport = require('passport');
const LocalStrategy = require('passport-local')
const users = require('../controllers/users.js')

router.get('/register',users.renderRegister);

router.post('/register', wrapAsync(users.register));

router.get('/login', users.renderLogin);

router.post('/login', passport.authenticate('local', {failureFlash:true, failureRedirect:'/login', failureMessage: true, keepSessionInfo: true}), wrapAsync(users.login));

router.get('/logout', users.logout)

module.exports = router;