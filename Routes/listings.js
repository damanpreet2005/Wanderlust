const express= require("express");
const router= express.Router();
const wrapAsync= require("../utils/wrapAsync.js");
const {isLoggedIn, validateListing, isOwner} = require("../middleware.js");
const listingController= require("../controllers/listing.js");
const multer  = require('multer');
const { cloudinary, storage } = require("../cloudConfig.js");
const upload = multer({ storage });

// home route
router
    .route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn, upload.single('listing[image]'), validateListing, wrapAsync(listingController.createListing));

// new route
router.get("/new", isLoggedIn, listingController.newListing);

// show route
router
    .route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn, isOwner, upload.single('listing[image]'), wrapAsync(listingController.updateListing))
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

// edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.editListing));

module.exports = router;