const express= require("express");
const router= express.Router({mergeParams: true});
const wrapAsync= require("../utils/wrapAsync.js");
const userController= require("../controllers/users.js");
const passport= require("passport");
const {savedRedirectUrl, validateUser}= require("../middleware.js");


// user registration route
router
    .route("/signup")
    .get(userController.getSignup)
    .post(validateUser, wrapAsync(userController.postSignup));

// user login route
router
    .route("/login")
    .get(userController.getLogin)
    .post(savedRedirectUrl, passport.authenticate("local", {
        failureRedirect: '/login',
        failureFlash: true
    }), userController.postLogin
);

// user logout route
router.get("/logout", userController.Logout);


module.exports= router;