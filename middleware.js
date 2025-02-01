const mongoose = require("mongoose");
const Listing=require("./models/listing");
const Review=require("./models/review");
const ExpressError=require("./utils/ExpressError.js");
const { ListingSchema, reviewSchema } = require('./schema.js');
module.exports.isloggedIn=(req, res, next) => 
{
    if(!req.isAuthenticated())
        {
          req.session.redirectUrl=req.originalUrl;
          req.flash("error","You must be logged in to create  listing");
       return  res.redirect("/login");
        }
        next();
};

module.exports.saveRedirectUrl=(req,res, next) =>
{
  if(req.session.redirectUrl)
  {
    res.locals.redirectUrl=req.session.redirectUrl;

  }
  next();
};

module.exports.isOwner = async(req,res,next) => 
{
  let { id } = req.params;
   let listing= await Listing.findById(id);
   if( !listing.owner.equals(res.locals.currUser._id))
   {
   req.flash("error","you are not the owner of this listing");
   return res.redirect(`/listings/${id}`);
   }
   next();
};

module.exports. validateListing = (req, res,next) =>
  {
    let {error}=ListingSchema.validate(req.body);
    if(error)
    {
      let errMsg=error.details.map((el) => el.message).join(",");
     throw new ExpressError(404,errMsg);
    }
    else
    {
      next();
    }
  };

  module.exports.validateReview = (req, res,next) =>
    {
      let {error}=reviewSchema.validate(req.body);
      if(error)
      {
        let errMsg=error.details.map((el) => el.message).join(",");
       throw new ExpressError(404,errMsg);
      }
      else
      {
        next();
      }
    };

    module.exports.isReviewAuthor = async (req, res, next) => {
      const { id, reviewId: rawReviewId } = req.params;
      const reviewId = rawReviewId.trim(); 
    
      if (!mongoose.Types.ObjectId.isValid(reviewId)) {
        req.flash("error", "Invalid review ID");
        return res.redirect(`/listings/${id}`);
      }
    
      const review = await Review.findById(reviewId);
    
      if (!review) {
        req.flash("error", "Review not found");
        return res.redirect(`/listings/${id}`);
      }
    
      if (!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the author of this review");
        return res.redirect(`/listings/${id}`);
      }
    
      next();
    };
    