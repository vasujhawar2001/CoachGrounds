const User = require('../models/user.js')

module.exports.renderRegister = (req,res)=>{
    res.render('auth/register');
}

module.exports.register = async(req,res)=>{
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
}

module.exports.renderLogin = (req,res)=>{
    res.render('auth/login')
}

module.exports.login = async(req,res)=>{
    //console.log(req.body);
    //console.log(req.session);
    const {username} = req.body;
    req.flash('success', `Welcome! ${username.charAt(0).toUpperCase()+username.slice(1)}`);
    const redirectUrl = req.session.returnTo || '/coachgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout = (req,res) => {
    req.logout(err => {
        if(err)
            return next(err);
        else{
            req.flash('success', 'Come Back Soon... :(');
            res.redirect('/coachgrounds');
        }})
}