const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const coursesSchema = new Schema({
  id: Number,
  title: String,
  price: Number,
  rating: Number,
  likes: Number,
  imageUrl: String,
  introVideo: String,
  description: String,
});

module.exports = mongoose.model("courses", coursesSchema);




