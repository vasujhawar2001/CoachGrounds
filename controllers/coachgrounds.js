const CoachGround = require('../models/coachground');
const {cloudinary} = require('../cloudinary/index.js')

module.exports.index = async (req, res) => {
    const coachgrounds = await CoachGround.find({});
    res.render('coachgrounds/index', { coachgrounds })
}

module.exports.renderNewForm = (req, res) => {
    res.render('coachgrounds/new');
}

module.exports.createCoachground = async (req, res, next) => {
        //if(!req.body.coachground){
      //  throw new ExpressError('Invalid Data', 400);

    const coachground = new CoachGround(req.body.coachground);
    coachground.images = req.files.map(f=>({url:f.path,filename:f.filename}))
    coachground.author = req.user._id;
    await coachground.save();
    console.log(coachground)
    req.flash('success', 'Successfully made a new coachground!');
    res.redirect(`/coachgrounds/${coachground._id}`)
}

module.exports.showCoachground = async (req,res, next)=>{
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
}

module.exports.renderEditForm = async (req,res)=>{
    const {id} = req.params;
    const coachground = await CoachGround.findById(id);
    if(!coachground){
        req.flash('error', "Cannot find it :(");
        return res.redirect('/coachgrounds');
    }
    res.render('coachgrounds/edit', {coachground})
}

module.exports.updateCoachground = async (req,res)=>{
    const {id} = req.params;
    //console.log(req.body);
    // added the isAuthor middleware --> const coachground = await CoachGround.findById(id)
    const coachground = await CoachGround.findByIdAndUpdate(id, {...req.body.coachground});
    const imgs = req.files.map(f=>({url:f.path,filename:f.filename}))
    coachground.images.push(...imgs);
    await coachground.save();
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
     await coachground.updateOne(
        {$pull:{
            images:{filename:{$in:req.body.deleteImages}}
        }}
    )
    console.log(coachground);
    }
    req.flash('success', 'Successfully Updated!')
    res.redirect(`/coachgrounds/${coachground._id}`);
}

module.exports.deleteCoachground = async(req,res)=>{
    const {id} = req.params;
    await CoachGround.findByIdAndDelete(id);
    req.flash('success', 'Successfully Deleted!!')
    res.redirect('/coachgrounds')
}