if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}
console.log(process.env.SECRET);

//required packages
const express= require("express"); 
const app= express();
const mongoose= require("mongoose");
const path= require("path");
const methodOverride= require("method-override");
const ejsMate= require("ejs-mate");
const session= require("express-session");
const MongoStore= require("connect-mongo");
const flash= require("connect-flash");
const passport= require("passport");
const LocalStrategy= require("passport-local").Strategy;
const User= require("./models/user.js");
const listingsRoutes= require("./Routes/listings.js");
const reviewRoutes= require("./Routes/review.js");
const userRoutes= require("./Routes/user.js");
const dbURL = process.env.ATLASD_URL;
// setting apps
app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));

//middlewares
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"public")));

// session configuration
const store = MongoStore.create({
    mongoUrl: dbURL,
    touchAfter: 24*3600,
    crypto: { secret: process.env.SECRET },
    tls: true 
});
store.on("error", function(e){
    console.log("Session store error", e);
});
app.use(session({
    store: store,
    secret: "Thisisasecretkey", 
    resave: false, 
    saveUninitialized: false,
    cookie: { expire: Date.now() + 1000 * 60 * 60 * 24 * 3,
        maxAge: 1000 * 60 * 60 * 24 * 3 }
}));
app.use(flash());

// passport configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// registering a custom view engine
app.engine("ejs", ejsMate);

// flash messages
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user; 
    console.log("Current user:", res.locals.currentUser);
    console.log("Flash message set up");
    next();
});

//connecting mongoose
main()
    .then(()=>{
        console.log("Connected to db");
    })
    .catch((err)=>{
        console.log(err);
    })

async function main(){
    await mongoose.connect(dbURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        tls: true
    });
}

// main route
app.get("/",(req,res)=>{
    res.render("listings/home.ejs");
})

// listing routes
app.use("/listings", listingsRoutes);

// review routes
app.use("/listings/:id/reviews", reviewRoutes);

// user routes
app.use("/", userRoutes);

// 404 error handling
app.use((err, req, res, next)=>{
    let{statusCode=500 ,message="Something went wrong"}= err;
    res.render("Error.ejs",{message});
    console.log(err);
});

//connection
app.listen(8080, ()=>{
    console.log("server is running at port 8080");
})