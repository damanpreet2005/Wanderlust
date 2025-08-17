const Review= require("../models/reviews.js");
const Listing= require("../models/listing.js");

module.exports.postReview= async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "New review added successfully!");
    res.redirect(`/listings/${id}`);
    console.log("new review saved:", newReview);
} 

module.exports.deleteReview = async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted successfully!");
    res.redirect(`/listings/${id}`);
}