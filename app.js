if(process.env.NODE_ENV!="production"){

  require('dotenv').config();
}
//console.log(process.env.SECRET);




const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync=require("./utlils/wrapAsync.js");
const ExpressError=require("./utlils/ExpressError.js");
const {listingSchema,reviewSchema}=require("./schema.js");
const Review = require("./models/review.js");

const listingsRouter=require("./routes/listing.js");
const reviewsRouter=require("./routes/review.js");
 //const review = require("./models/review.js");
 const session=require("express-session");
 const MongoStore=require("connect-mongo");
 const flash=require("connect-flash");
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js');
const userRouter=require("./routes/user.js");



//mongodb+srv://<db_username>:<db_password>@cluster0.mqnmt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
  const dbUrl=process.env.ATLASDB_URL; 

app.use(express.static(path.join(__dirname,"/public")));


const store =  MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET, 
      },
      touchAfter: 24 * 3600,
});

store.on("error", () => {
    console.log("Error in MONGODB SESSION", err);
});
const sessionOptions={
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
cookie:{
  expires:Date.now()+7*24*60*60*1000,
  maxAge:7*24*60*60*1000,
  httpOnly:true,

}
,};



app.use(session(sessionOptions));
app.use(flash());



// Passport Middleware ↓
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));


// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



//cureent user jiska session hua hai 
app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.currUser=req.user;
  next();
  
  
});


// Demo Register
// app.get("/demouser", async(req, res) => {
//     let fakeser = new User ({
//         email: "arsh@gmail.ocm",
//         username: "arshx"
//     });
//     let regUser = await User.register(fakeser, "helloworld");
//     res.send(regUser);
// });


main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);

app.get("/", (req, res) => {
   res.render("index.ejs");
});


app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter);



app.all('/*path/',(req,res,next)=>{
  next(new ExpressError(404,"page not foundhv"));
});

 

// })

///handle all fault

app.use((err, req, res, next) => {
    //let {statusCode = 500, message = "Something Went Wrong..."} =err;
    //res.render("error.ejs");
   // res.status(statusCode).send(message );
   //console.error(err.stack);
  const statusCode = err.statusCode||500;
  const message = err.message|| "something went wrong";
   console.log(statusCode);
   console.log("About to render error.ejs with status:", statusCode, "and message:", message);
    res.status(statusCode).render("error.ejs", { message });
});

app.listen(8080, () => {
  console.log("server is listening to port 8080");
});
 
