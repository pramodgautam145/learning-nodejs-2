const express = require("express");
const axios = require("axios").default;
const cors = require("cors");
const app = express();
const { randomBytes } = require("crypto");

const posts = {};

app.use(cors());
app.use(express.json());

// get allPosts
app.get("/posts", (req, res) => {
  res.send(posts);
});

// add new post
app.post("/posts", async (req, res) => {
  const id = randomBytes(4).toString("hex");
  const { title } = req.body;

  // storing the post (db)
  posts[id] = { id, title };
  //notify event bus
  await axios.post("http://localhost:4003/events",{
    type:"Post created",
    data: {id,title},
  }).catch(err=>console.log(err));
  res.status(201).send(posts[id]);
});

app.post("/events", (req, res) => {
  console.log("Received Event : ", req.body.type);
  res.send({});
});

app.listen(4000, () => {
  console.log("Posts service running at 4000 !");
});
