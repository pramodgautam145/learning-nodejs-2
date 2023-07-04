const express = require("express");
const axios = require("axios").default;
const amqp = require("amqplib");

const app = express();
var connection, channel;

// connecting to rabbitmq
async function connectToRabbitMQ() {
  const amqpServer = "amqp://localhost";
  connection = await amqp.connect(amqpServer);
  channel = await connection.createChannel();
  await channel.assertQueue("product-created-queue"); // .env
  await channel.assertQueue("review-created-queue"); // .env
}
connectToRabbitMQ().then(() => {
  // consuming from product-created-queue
  channel.consume("product-created-queue", payload => {
    let { type, newProduct } = JSON.parse(payload.content);
    console.log("Event Received : ", type, newProduct);
    channel.ack(payload);
  });

  channel.consume("review-created-queue", payload => {
    let { type, newReview } = JSON.parse(payload.content);
    console.log("Event Received : ", type, newReview);
    channel.ack(payload);
  });
});

const products = {};

app.use(express.json());

// Endpoint for the client to communicate
app.get("/products", (req, res) => {
  res.json(products);
});

app.listen(4002, () => {
  console.log("Query Service running at port 4002");
});

// const { type, data } = req.body;
// console.log("Event Received : ", type);

// if (type == "ProductCreated") {
//   const { id, title, price } = data;
//   products[id] = { id, title, price, reviews: [] };
// } else if (type == "ReviewCreated") {
//   // add a review for that product (push)
//   const { id, content, productId } = data;
//   const product = products[productId];
//   product.reviews.push({ id, content });
// }
// console.log("Query", products);
