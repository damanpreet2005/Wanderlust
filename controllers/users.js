const User= require("../models/user.js");

module.exports.getSignup=(req, res) => {
    res.render("listings/signup.ejs");
}

module.exports.postSignup= async (req, res) => {
    try{
        let { username, email, password } = req.body;
        let newUser = new User({email, username });
        const registeredUser = await User.register(newUser, password);     
        req.login(registeredUser, (err) => {
            if (err) return next(err);
            req.flash("success", "Welcome to Wanderlust!");
            res.redirect("/listings");
        });
        console.log("New user registered:", registeredUser);
    } catch(err){
        console.error("Error during user registration:", err);
        req.flash("error", "Registration failed. Please try again.");
        res.redirect("/signup");  
    }
}

module.exports.getLogin=(req, res) => {
    res.render("listings/login.ejs");
}

module.exports.postLogin=(req, res) => {
        req.flash("success", "Welcome back!");
        res.redirect(res.locals.redirectUrl || "/listings");
}

module.exports.Logout=(req, res) => {
    req.logout((err) => {
        if (err) {
            console.error("Error during logout:", err);
            return next(err);
        }
        req.flash("success", "Goodbye!");
        res.redirect("/listings");
    });
}