module.exports.logout = (req, res, next) => {
       req.logout((err) => { 
              if (err) {
                     return next(err);
              }
              req.flash("success", "You have successfully logged out!");  
              res.redirect("/index");  
       });
}