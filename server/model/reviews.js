const mongoose = require('mongoose');


const reviewProduct = new mongoose.Schema({
  _id: {type: Number, required: true},
  reviews:[]
})

const model= mongoose.model('reviewProduct', reviewProduct, 'reviewsAgg')

module.exports ={

  getReviews: (productID)=>{
    return model.find({_id:productID})
    .then((reviews)=> {
      reviews= reviews[0]
      var results = []
      reviews.reviews.forEach((review)=>{
        if(review.reported ){
          return
        }
        formatedReview= {
          review_id: review.id,
          rating:review.rating,
          summary: review.summary,
          recomended: review.recommend,
          response:review.response,
          body:review.body,
          date:review.date,
          reviewer_name: review.reviewer_name,
          helpfulness:review.helpfulness,
          photos: review.photos,
        }
        results.push(formatedReview)
      })
       var response = {
         product: reviews._id,
         page:0,
         count: 5,
         results:results,
       }
       return response;
    })
    .catch((err)=>  err)

  }
}
