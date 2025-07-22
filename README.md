# wanderlust

app .js all route at same position

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

const listings=require("./routes/listing.js");
const reviews=require("./routes/review.js");
 //const review = require("./models/review.js");


app.use(express.static(path.join(__dirname,"/public")));

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);

app.get("/", (req, res) => {
  res.send("Hi, I am root");
});


//validation 
// const validateListing=(req,res,next)=>{
//    let {error}=listingSchema.validate(req.body);
//  // console.log(result);
  
//   if(error){
//     let errMsg=error.details.map((el)=>el.message).join(",");
//     throw new ExpressError(400,errMsg);
//   }else{
//     next();
//   }

// }

//validate reviews

// const validateReview=(req,res,next)=>{
//    let {error}=reviewSchema.validate(req.body);
//  // console.log(result);
  
//   if(error){
//     let errMsg=error.details.map((el)=>el.message).join(",");
//     throw new ExpressError(400,errMsg);
//   }else{
//     next();
//   }

// }

app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);

//Index Route
// app.get("/listings",wrapAsync( async (req, res) => {
//   const allListings = await Listing.find({});
//   res.render("listings/index.ejs", { allListings });
// }));
 

//New Route
// app.get("/listings/new", (req, res) => {
//   res.render("listings/new.ejs");
// });




//Show Route
// app.get("/listings/:id",wrapAsync( async (req, res) => {
//   let { id } = req.params;
//   const listing = await Listing.findById(id).populate("reviews");
//   res.render("listings/show.ejs", { listing });
// }));

//Create Route
// app.post("/listings",validateListing, wrapAsync( async(req, res,next) => {

//   // const result=listingSchema.validate(req.body);
//   // console.log(result);
  
//   // if(result.error){
//   //   throw new ExpressError(400,result.error);
//   // }
//   const newListing = new Listing(req.body.listing);
//   // if(!newListing.description){
//   //   throw new ExpressError(400,"descrption not fppund");
//   // }
//   // if(!newListing.title){
//   //   throw new ExpressError(400,"title not fppund");
//   // }
//   // if(!newListing.price){
//   //   throw new ExpressError(400,"price not fppund");
//   // }
//   await newListing.save();
//   res.redirect("/listings");
  
// }));

//Edit Route
// app.get("/listings/:id/edit", async (req, res) => {
  
//   let { id } = req.params;
//   const listing = await Listing.findById(id);
//   res.render("listings/edit.ejs", { listing });
// });

//Update Route
// app.put("/listings/:id",validateListing, wrapAsync(async (req, res) => {
//   // if(!req.body.listing){
//   //   throw new ExpressError(400,"send valid data");
//   // }
//   let { id } = req.params;
//   await Listing.findByIdAndUpdate(id, { ...req.body.listing });
//   res.redirect(`/listings/${id}`);
// }));

//Delete Route
// app.delete("/listings/:id", async (req, res) => {
//   let { id } = req.params;
//   //this triiger post middle ware present in listing
//   let deletedListing = await Listing.findByIdAndDelete(id);
//   console.log(deletedListing);
//   res.redirect("/listings");
// });


//reviews
//post route

// app.post("/listings/:id/reviews",validateReview,wrapAsync(async (req,res)=>{

//    let listing=await Listing.findById(req.params.id);
//    let newReview =new Review(req.body.review);

//    listing.reviews.push(newReview);
//     await newReview.save();
//     await listing.save();

//     console.log("saved review");
//     res.redirect(`/listings/${listing._id}`);


// }));


//delete review

// app.delete("/listings/:id/reviews/:reviewId",wrapAsync(async(req,res)=>{

//   let {id,reviewId}=req.params;
//   await Review.findById(reviewId);

//   await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
//   await Review.findByIdAndDelete(reviewId);

//   res.redirect(`/listings/${id}`);
// }))


// app.get("/testListing", async (req, res) => {
//   let sampleListing = new Listing({
//     title: "My New Villa",
//     description: "By the beach",
//     price: 1200,
//     location: "Calangute, Goa",
//     country: "India",
//   });

//   await sampleListing.save();
//   console.log("sample was saved");
//   res.send("successful testing");
// });


app.all('/*path/',(req,res,next)=>{
  next(new ExpressError(404,"page not foundhv"));
});

// Random Page Error Handling Middle Ware ↓
// app.all("*", (req, res, next) => {
//     next(new ExError(404, "Page Not Found !!!"));
// });

// app.use((err,req,res,next)=>{
//   let {statusCode,message}=err;
//   console.log("something went wrong"+statusCode);
//   //res.status(statusCode).send(message);
 

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
