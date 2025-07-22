const express = require('express');
const router = express.Router();
const wrapAsync = require("../utlils/wrapAsync.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const ExpressError = require("../utlils/ExpressError.js");
const Listing = require("../models/listing.js");
const passport = require('passport');
//const {isLoggedIn,isOwner}=require("../middleware.js");


const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require('../controllers/listing.js');
const multer = require('multer');
const { storage } = require('../cloudConfig.js');
const upload = multer({ storage });




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


router.route("/").
  get(wrapAsync(listingController.index))
  .
  post(isLoggedIn,
    upload.single('listing[image]'), validateListing, wrapAsync(listingController.createListing));
// .post(upload.single('listing[image][url]'),(req,res)=>{
//   res.send(req.file);
// })


//Create New Page Route ↓
router.get("/new", isLoggedIn, listingController.renderNewForm);


router.route("/:id").get(wrapAsync(listingController.showListing))
  .put(isLoggedIn, isOwner,
     upload.single('listing[image]'),
    validateListing, wrapAsync(listingController.updateListing)).
  delete(isLoggedIn, listingController.destroyListing);

// Index Route and Create Post Route using (router.route) ↓
//router.get("/",wrapAsync( listingController.index));

// //Create New Page Route ↓
// router.get("/new",isLoggedIn, listingController.renderNewForm);

// show
// router.get("/:id",wrapAsync( listingController.showListing));



//create
//router.post("/",isLoggedIn,validateListing, wrapAsync( listingController.createListing));


//Edit Route
router.get("/:id/edit", isLoggedIn, listingController.renderEditForm);

//Update Route
// router.put("/:id",isLoggedIn,isOwner,validateListing, wrapAsync(listingController.updateListing));

//Delete Route
//router.delete("/:id",isLoggedIn,listingController.destroyListing );
module.exports = router;