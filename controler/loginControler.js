module.exports.login = (req, res) => {
       req.flash("success", "Welcome!");
       const redirectUrl = res.locals.redirectUrl || "/index";  
       res.redirect(redirectUrl);
}