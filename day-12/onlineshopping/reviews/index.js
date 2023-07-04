const express = require("express");
const axios = require("axios").default;
const { randomBytes } = require("crypto");
const amqp = require("amqplib");
const mongoose = require("mongoose");
const Review = require("./models/reviews.model");

const app = express();
var connection, channel;
//127.0.0.1:27017
mongoose.connect(
  "mongodb://127.0.0.1:27017/reviewsdb",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log("Reviews Service DB Connected !");
  },
);

// connecting to rabbitmq
async function connectToRabbitMQ() {
  const amqpServer = "amqp://localhost";
  connection = await amqp.connect(amqpServer);
  channel = await connection.createChannel();
  await channel.assertQueue("review-created-queue"); // .env
}
//connectToRabbitMQ();

app.use(express.json());

// get all reviews
app.get("/products/:id/reviews", (req, res) => {
  res.send(reviewsByProductId[req.params.id] || []);
});

// add new review
app.post("/products/:id/reviews", async (req, res) => {
  const id = randomBytes(4).toString("hex");
  const { content } = req.body;
  const productId = req.params.id;

  // add review to db

  const newReview = new Review({ id, content, productId });
  await newReview.save(); // insert new review in db (reviews)

  // notify the event bus
  // channel.sendToQueue(
  //   "review-created-queue",
  //   Buffer.from(JSON.stringify({ type: "ReviewCreated", newReview })),
  // );
  res.status(201).send(newReview);
});

app.listen(4001, () => {
  console.log("Reviews Service running at 4001 !");
});
