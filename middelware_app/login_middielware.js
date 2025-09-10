module.exports.isLogin = (req, res, next) => {
       if (!req.isAuthenticated()) {
              req.session.redirectUrl = req.originalUrl;  
              req.flash("error", "Please log in first!");
              return res.redirect("/login");
       }
       next();
};

module.exports.storeReturnTo = (req, res, next) => {
       if (req.session.redirectUrl) {
              res.locals.redirectUrl = req.session.redirectUrl;
       }
       next();
};
