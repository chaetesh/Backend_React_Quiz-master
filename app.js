var createError = require("http-errors");
var cors = require('cors');
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var cors = require("cors");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var quizRouter = require("./routes/quiz");
var questionsRouter = require("./routes/question");
var paymentRouter = require("./routes/paymentRoute");
var passwordResetRoutes = require("./routes/passwordReset");
require("dotenv").config();

//mongoDB connection
const mongoURI = "mongodb+srv://admin:admin123@quiz.1ybqeer.mongodb.net/quiz?retryWrites=true&w=majority";
mongoose.connect(
  mongoURI,
  () => console.log("**Database connected**")
  );
  
  const port = process.env.port || 3001;
  var app = express();
  
  app.use(cors())

  // view engine setup
  app.set("views", path.join(__dirname, "views"));
  app.set("view engine", "jade");
  
  app.use(logger("dev"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, "public")));
  
  app.use("/api/v1", indexRouter);
  app.use("/api/v1/users", usersRouter);
  app.use("/api/v1/quiz", quizRouter);
  app.use("/api/v1/questions", questionsRouter);
  app.use("/api/v1/payment", paymentRouter);
  app.use("/api/v1/password-reset", passwordResetRoutes);
  
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
    res.json({ error: err.message });
  });
  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })

module.exports = app;
