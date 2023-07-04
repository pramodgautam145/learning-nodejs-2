const express = require("express");
const axios = require("axios").default;
const { randomBytes } = require("crypto");
const amqp = require("amqplib");

const app = express();
var connection, channel;

// connecting to rabbitmq
async function connectToRabbitMQ() {
  const amqpServer = "amqp://localhost";
  connection = await amqp.connect(amqpServer);
  channel = await connection.createChannel();
  await channel.assertQueue("product-created-queue"); // .env
}
connectToRabbitMQ();

// should be in db
// { ID : {id,title,price},ID:{}}
const products = {};

app.use(express.json());

// routes for products
// get all products
app.get("/products", (req, res) => {
  res.json(products);
});

// adding a new product
app.post("/product/create", (req, res) => {
  const id = randomBytes(4).toString("hex");
  const { title, price } = req.body;

  // save product to db
  products[id] = { id, title, price };
  let newProduct = products[id];

  // notify event bus -> publish the msg with the payload
  channel.sendToQueue(
    "product-created-queue",
    Buffer.from(JSON.stringify({ type: "ProductCreated", newProduct })),
  );
  res.status(201).send(products[id]);
});

app.listen(4000, () => {
  console.log(`Products Service running at port 4000 !`);
});
