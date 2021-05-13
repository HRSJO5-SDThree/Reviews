
const newrelic = require('newrelic')
const express = require('express');
const reviewsModel = require('./model/reviews')
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express()
const port = 3000;


mongoose.connect('mongodb://ubuntu@54.177.210.81/RatingsReviews')


app.use(bodyParser.json());


app.get('/reviews', async (req, res)=>{
  var reviews = await reviewsModel.getReviews(req.query.product_id)
  res.send(reviews)
})


app.get('/reviews/meta', async (req, res)=>{
  var meta = await reviewsModel.getMeta(req.query.product_id)
  res.send(meta)
})

app.post('/reviews', async (req, res)=>{
  var status = await reviewsModel.postReview(req.body)
  res.status(status).end()
})

app.put('/reviews/:review_id/helpful', async (req, res)=>{
  var status = await reviewsModel.markHelpful(req.params.review_id)
  res.status(status).end()
})

app.put('/reviews/:review_id/report', async (req, res)=>{
  var status = await reviewsModel.markReported(req.params.review_id)
  res.status(status).end()
})


app.listen(port, () => console.log(`Listening on ${port}`));