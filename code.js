if (process.env.NODE_ENV !== "production") {
       require("dotenv").config();
}

const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const engine = require("ejs-mate");
const methodOverride = require("method-override");
const RoutingError = require("./HandelErrorFolder/routNotDefine");
const customerror = require("./HandelErrorFolder/if_else_error_handling");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./schemas/signupSchema");
const { isLogin, storeReturnTo } = require("./middelware_app/login_middielware");

const allList = require("./controler/postControlerAndReview");
const sign = require("./controler/signupControler");
const log = require("./controler/loginControler");
const out = require("./controler/logoutControler");

const multer = require("multer");
const { storage } = require("./cloudinary");
const upload = multer({ storage });

main()
       .then(() => console.log("MongoDB connected ✅"))
       .catch((err) => console.log("MongoDB Error ❌", err));

async function main() {
       await mongoose.connect("mongodb://127.0.0.1:27017/airbnb");
}

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static("public"));
app.engine("ejs", engine);
app.set("view engine", "ejs");

app.use(
       session({
              secret: "yourSecretKey",
              resave: false,
              saveUninitialized: true,
       })
);
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy({ usernameField: "email" }, User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
       res.locals.success = req.flash("success");
       res.locals.errors = req.flash("error");
       res.locals.currentUser = req.user;
       next();
});


app.get("/index/newpost", isLogin, (req, res) => {
       res.render("post");
});

app.get("/", customerror(allList.homePage));

app.get("/index", customerror(allList.homePage));

app.get("/index/:id", customerror(allList.details));

app.get("/index/:id/detail", isLogin, customerror(allList.edit));

app.post(
       "/index/:id/update",
       isLogin,
       upload.single("image"),
       customerror(allList.update)
);

app.post(
       "/index/newpost/submit",
       upload.single("mainSchema[image]"),
       customerror(allList.newpostSabmit)
);

app.get("/index/:id/deletepost", isLogin, customerror(allList.deletePost));

app.post("/index/:id/review", isLogin, customerror(allList.newReviewAdd));

app.get(
       "/index/:id/review/:reviewid",
       isLogin,
       customerror(allList.reviewDelete)
);

app.get("/signup", (req, res) => {
       res.render("sign_up_form");
});
app.post("/signup", customerror(sign.signup));

app.get("/login", (req, res) => {
       res.render("login_form");
});
app.post(
       "/login",
       storeReturnTo,
       passport.authenticate("local", {
              failureRedirect: "/login",
              failureFlash: true,
       }),
       log.login
);

app.get("/logout", out.logout);

app.use((req, res, next) => {
       next(new RoutingError(404, "Route not found, please try again!"));
});

app.use((err, req, res, next) => {
       if (err.name === "ValidationError") {
              const validationMsg =
                     err.errors?.price?.properties?.message || err.message;
              req.flash("error", validationMsg);
       }

       const url = req.originalUrl;

       if (url.includes("/newpost/submit")) {
              req.flash("error", err.message);
              return res.redirect("/index/newpost");
       }

       if (url.includes("/index/:id/review")) {
              const id = req.params?.id || req.body?.id || req.query?.id;
              if (!id) {
                     req.flash("error", "ID not found, please try again.");
                     return res.redirect("/index");
              }
              req.flash("error", err.message || "Something went wrong while adding review.");
              return res.redirect(`/index/${id}`);
       }

       req.flash("error", err.message || "Something went wrong!");
       return res.redirect("/index");
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
       console.log(`✅ Server running on http://localhost:${port}`);
});


