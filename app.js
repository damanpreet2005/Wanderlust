//required packages
const express= require("express");
const app= express();
const mongoose= require("mongoose");
const Listing= require("./models/listing.js");
const path= require("path");
const methodOverride= require("method-override");
const ejsMate= require("ejs-mate");

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

app.post("/listings",async (req,res)=>{
    let newListing= new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings")
});

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
app.put("/listings/:id", async (req,res)=>{
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

//connection
app.listen(8080, ()=>{
    console.log("server is running at port 8080");
})