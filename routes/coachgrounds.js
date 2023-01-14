const express = require('express');
const router = express.Router();
const wrapAsync = require('../utilities/wrapAsync.js')
const CoachGround = require('../models/coachground.js')
const {isLoggedIn, isAuthor, validateCoachground} = require('../middleware.js')
const coachgrounds = require('../controllers/coachgrounds.js')
const multer = require('multer');
const {storage} = require('../cloudinary/index.js');
const upload = multer({storage})


router.get('/', wrapAsync(coachgrounds.index))

router.get('/new', isLoggedIn, coachgrounds.renderNewForm)

router.post('/', isLoggedIn, upload.array('image'), validateCoachground, wrapAsync(coachgrounds.createCoachground))

router.get('/:id', wrapAsync(coachgrounds.showCoachground))

router.get('/:id/edit', isLoggedIn, isAuthor, wrapAsync(coachgrounds.renderEditForm))

router.put('/:id', isLoggedIn, isAuthor, upload.array('image'), validateCoachground, wrapAsync(coachgrounds.updateCoachground));

router.delete('/:id', isLoggedIn, isAuthor, wrapAsync(coachgrounds.deleteCoachground))

module.exports = router;

 