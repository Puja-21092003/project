    const Listing=require("../models/listing");
    const Review=require("../models/review");
    const mongoose = require('mongoose');
    module.exports.createReview=async(req,res) => 
        {
        console.log(req.params.id);
        const listing=await Listing.findById(req.params.id);
        let newReview = new Review(req.body.review);
        newReview.author=req.user._id;
        console.log(newReview);
        listing.reviews.push(newReview);
        await newReview.save();
        await listing.save();
        req.flash("success", " New Review Created!")
        res.redirect(`/listings/${listing._id}`);
        };

        module.exports.destroyReview=async (req, res) => {
                  const { id,reviewId: rawReviewId } = req.params;
                  const reviewId = rawReviewId.trim();
                  if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(reviewId)) {
                    return res.status(400).send("Invalid ID format");
                  } 
                  await Listing.findByIdAndUpdate(id, { $pull: { review: reviewId } });
                  await Review.findByIdAndDelete(reviewId); 
                  req.flash("success", " Review Deleted!")
                  res.redirect(`/listings/${id}`);
                };