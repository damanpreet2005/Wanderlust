//required packages
const express= require("express");
const app= express();
const mongoose= require("mongoose");
const Listing= require("./models/listing.js");
const path= require("path");
const methodOverride= require("method-override");
const ejsMate= require("ejs-mate");
const wrapAsync= require("./utils/wrapAsync.js");
const ExpressError= require("./utils/ExpressError.js");
const {listingSchema}= require("./schema.js");

// setting apps
app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));

//middlewares
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"public")));

// registering a custom view engine
app.engine("ejs", ejsMate);

//connecting mongoose
main()
    .then(()=>{
        console.log("Connected to db");
    })
    .catch((err)=>{
        console.log(err);
    })

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

// temporary test route for debugging
app.get("/test", (req, res) => {
    res.send("Test route working");
});

const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errMsg= error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}

// main route
app.get("/",(req,res)=>{
    res.render("listings/home.ejs");
})

// home route
app.get("/listings",async (req,res)=>{
    const allListings= await Listing.find({});
    res.render("listings/index.ejs",{allListings});
})

// new route
app.get("/listings/new", async (req,res)=>{
    res.render("listings/new.ejs");

});

// create route
app.post("/listings", validateListing, wrapAsync(async (req,res, next)=>{
    let newListing= new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings")
    
}));

// show route
app.get("/listings/:id", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
});

// edit route
app.get("/listings/:id/edit", async (req,res)=>{
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
})

// update route
app.put("/listings/:id", validateListing, async (req,res)=>{
    let { id }= req.params;
    const listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
})

//delete route
app.delete("/listings/:id", async (req,res)=>{
    let { id }= req.params;
    const listing= await Listing.findByIdAndDelete(id);
    console.log(listing);
    res.redirect("/listings");
})


// app.all("*",(req,res,next)=>{
//     next(new ExpressError(404,"Page not found"));
// })

app.use((err, req, res, next)=>{
    let{statusCode=500 ,message="Something went wrong"}= err;
    res.render("Error.ejs",{message});
});

//connection
app.listen(8080, ()=>{
    console.log("server is running at port 8080");
})