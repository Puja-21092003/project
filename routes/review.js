const express =require("express");
const mongoose = require('mongoose');
const router= express.Router({mergeParams:true});
const  wrapAsync =require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {validateReview, isloggedIn, isReviewAuthor} = require("../middleware.js");
   
const reviewController=require("../controllers/review.js");

//post Review  route
router.post("/",isloggedIn,validateReview,
  wrapAsync(reviewController.createReview));
       
  //Delete Review Route
        router.delete("/:reviewId", 
          isloggedIn,
          isReviewAuthor,
          wrapAsync(reviewController.destroyReview));

        module.exports =router;