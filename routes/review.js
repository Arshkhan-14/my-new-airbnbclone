const express = require('express');
const router = express.Router({mergeParams:true});
const wrapAsync=require("../utlils/wrapAsync.js");
const {listingSchema,reviewSchema}=require("../schema.js");
const ExpressError=require("../utlils/ExpressError.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
 const {  validateReview, isLoggedIn,isReviewAuthor } = require("../middleware.js");
 const reviewController = require('../controllers/reviews.js')


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



//post route

router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview));


//delete review

router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview))


module.exports=router;