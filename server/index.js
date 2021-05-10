
const express = require('express');
const reviewsModel = require('./model/reviews')
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express()
const port = 3000;


mongoose.connect('mongodb://localhost:27017/RatingsReviews')

app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: true }));

app.get('/reviews', async (req, res)=>{
  var reviews = await reviewsModel.getReviews(req.query.product_id)
  res.send(reviews)
})


app.get('/reviews/meta', async (req, res)=>{
  var meta = await reviewsModel.getMeta(req.query.product_id)
  res.send(meta)
})

app.post('/reviews', async (req, res)=>{
  var status = await reviewsModel.PostReview(req.body)
  res.send(status)
})


app.listen(port, () => console.log(`Listening on ${port}`));