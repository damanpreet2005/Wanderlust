const Listing= require("../models/listing.js");
const Review = require("../models/reviews.js");

module.exports.index= async(req, res, next) => {
    const allListings= await Listing.find({});
    res.render("listings/index.ejs",{ allListings, showFilters: true });
}

module.exports.showListing= async(req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
}

module.exports.newListing= (req, res) => {
    res.render("listings/new.ejs");
}

module.exports.createListing= async (req,res, next)=>{
    let url=req.file.path;
    let filename=req.file.filename;
    console.log(url, "..", filename)
    let newListing= new Listing(req.body.listing);
    newListing.owner= req.user._id;
    newListing.image = { url, filename };
    await newListing.save();
    req.flash("success", "New listing created successfully!");
    res.redirect("/listings")
}

module.exports.editListing= async (req,res)=>{
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }
    let originalImage = listing.image.url;
    originalImage = originalImage.replace("/upload", "/upload/w_300"); 
    res.render("listings/edit.ejs", { listing, originalImage });
}

module.exports.updateListing= async (req,res)=>{
    let { id }= req.params;
    const listing= await Listing.findByIdAndUpdate(id, {...req.body.listing}, { new: true });
    if (req.file) {
        listing.image = { url: req.file.path, filename: req.file.filename };
    }
    await listing.save();
    
    req.flash("success", "Listing updated successfully!");
    res.redirect(`/listings/${listing._id}`);
}

module.exports. deleteListing= async (req,res)=>{
    let { id }= req.params;
    const listing = await Listing.findById(id);
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted successfully!");
    console.log(listing);
    res.redirect("/listings");
    
}