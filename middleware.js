const isLoggedIn = (req, res, next) => {
    
    if(!req.isAuthenticated()){
        //check the url they are requesting
        //console(req.path,req.originalUrl)
        req.session.returnTo = req.originalUrl
        req.flash('error', 'PLease Sign In first.');
        return res.redirect('/login');
    }
    next();
}

module.exports = isLoggedIn
