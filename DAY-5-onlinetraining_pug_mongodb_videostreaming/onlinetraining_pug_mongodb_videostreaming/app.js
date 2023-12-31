var createError = require("http-errors");
var express = require("express");
var path = require("path");
var courses = require("./model/course.model");

var logger = require("morgan");

var coursesRouter = require("./routes/courses");
const mongoose = require("mongoose");
var app = express();

//mongoose.connect("mongodb://127.0.0.1:27017/coursesdb");
mongoose.connect("mongodb+srv://xxxxxx:xxxxxxx@cluster0.apmw2bw.mongodb.net/coursesdb");
mongoose.connection.once("open",()=>{
  console.log("Connected to database !")
});
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.use("/", coursesRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
