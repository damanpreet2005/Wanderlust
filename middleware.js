const Listing = require('./models/listing');
const Review = require('./models/reviews');
const {listingSchema}= require("./schema.js");
const ExpressError= require("./utils/ExpressError.js");
const {reviewSchema}= require("./schema.js");
const {userSchema}= require("./schema.js");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to do that");
        return res.redirect("/login");
    }
    next();
}

module.exports.savedRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req, res, next) => {
    let { id }= req.params;
    const listing = await Listing.findById(id);
    if (!listing.owner.equals(res.locals.currentUser._id)) {
        req.flash("error", "You are not authorized to do that");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.isAuthor = async (req, res, next) => {
    let { id,reviewId }= req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(res.locals.currentUser._id)) {
        req.flash("error", "You are not authorized to do that");
        return res.redirect(`/listings/${id}`);
    }
    next();
}


module.exports.validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errMsg= error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}

module.exports.validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg= error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}

module.exports.validateUser= (req,res,next)=>{
    let {error}=userSchema.validate(req.body);
    if(error){
        let errMsg= error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}
