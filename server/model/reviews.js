const mongoose = require('mongoose');


const reviewProduct = new mongoose.Schema({
  _id: {type: Number, required: true},
  reviews:[{
    id: Number,
    product_id: Number,
    helpfulness: Number,
    reported: Boolean,
    review_id: Number,
    rating: Number,
    summary: String,
    recomended: Boolean,
    response: String,
    body: String,
    review_email: String,
    date: Date,
    reviewer_name: String,
    photos: Object,
    characteristics: Object,
  }]
})

const model= mongoose.model('reviewProduct', reviewProduct, 'reviewsAgg');
const counter= mongoose.model('counter', {count: Number}, 'counter');


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
  },


  getMeta: (productID)=>{
    return model.find({_id:productID})
    .then((reviews)=> {
      reviews= reviews[0];
      var recommended= {'0': 0};
      var ratings = {
        '1': 0,
        '2': 0,
        '3': 0,
        '4': 0,
        '5': 0,
      }
      var characteristics= {}
      reviews.reviews.forEach((review)=>{
        if (review.recommend){
          recommended['0']++
        }
        ratings[review.rating.toString()]++;
        review.characteristics.forEach(characteristic => {
          if(!characteristics[characteristic.name[0].name]){
            characteristics[characteristic.name[0].name]= characteristic.value
          }
          characteristics[characteristic.name[0].name]+= characteristic.value
        })
      })
      for(var key in characteristics){
          characteristics[key]= (characteristics[key] / reviews.reviews.length)
        }
       var response = {
         product_id: reviews._id,
         ratings:ratings,
         recommended: recommended,
         characteristics: characteristics,
       }
       return response;
    })
    .catch((err)=>  err)

  },

  postReview: async (reviewData)=>{
   var reviewID= await counter.findOne({}, {count: 1})
   reviewID = reviewID.count +1;
   await counter.updateOne({}, {$inc: {count:1}})
    var characteristics= [];
    for (var key in reviewData.characteristics){
      var charObj= {
        characteristic_id: key,
        value: reviewData.characteristics[key]['value'],
        name: [{name: reviewData.characteristics[key]['name']}],
      }
      characteristics.push(charObj)
    }
    newReview ={
      id: reviewID,
      product_id:reviewData.product_id,
      rating: reviewData.rating,
      date: Date(),
      summary: reviewData.summary,
      body:reviewData.body,
      recommend: reviewData.recommend,
      reported: false,
      helpfulness: 0,
      reviewer_name: reviewData.name,
      review_email: reviewData.email,
      photos: reviewData.photos,
      characteristics: [charObj],
    }
    return model.findOneAndUpdate({_id:reviewData.product_id}, {$push: {reviews: newReview}})
    .then(()=> 201)
    .catch(()=>500)
  },



  markHelpful: (reviewID)=>{
    reviewID = Number(reviewID);
    return model.updateOne({'reviews.id': reviewID }, {$inc: {'reviews.$[rev].helpfulness': 1}}, {arrayFilters:[{'rev.id':reviewID}]})
    .then(()=> 204)
    .catch(()=>500)
  },

  markReported: (reviewID)=>{
    reviewID = Number(reviewID);
    return model.updateOne({'reviews.id': reviewID }, {$set: {'reviews.$[rev].reported': true}}, {arrayFilters:[{'rev.id':reviewID}]})
    .then(()=> 204)
    .catch(()=>500)
  }

}


