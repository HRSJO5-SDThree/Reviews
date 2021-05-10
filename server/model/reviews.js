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

  PostReview: (reviewData)=>{
    console.log(reviewData)
  },

}



// {
//   "product_id": 13023,
//   "rating": 5,
//   "summary": "summary",
//   "body": "ahdskfjhaksjdfhkaJHDFajhdfkajhdfsjkahdjsfhadskjfhakjsdhfakjsdhdfjkajsdhdfakjsdfh",
//   "recommend": false,
//   "name": "user123",
//   "email": "fake@gmail.com",
//   "photos": [ "https://fec-04-21.s3.amazonaws.com/cat2.jpeg" ],
//   "characteristics": { "43617": 1, "43618": 1, "43619": 1, "43620": 1 }
// }