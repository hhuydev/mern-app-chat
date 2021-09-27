const express = require("express");
require("./db/connect-db");
const route = require("./routers/index.route");
const morgan = require("morgan");
const path = require("path");
const fs = require("fs");
const HttpError = require("./utils/http-error");

const app = express();
/**Cho phep client lay anh tu server */
app.use("/uploads/images", express.static(path.join("uploads", "images")));

/**Handle CORS */
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
});

/**config = middleware */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("combined"));

route(app);

app.use((req, res, next) => {
  throw new HttpError("Invalid route", 404);
});

app.use((err, req, res, next) => {
  res.locals.error = err;
  if (err.status >= 100 && err.status < 600) res.status(err.status);
  else res.status(500);
  res.render("error");
});

/**Su dung middleware error default cho express cung cap khi co bat cu loi nao cac route */
app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  }
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.send({ message: error.message || "An unknown error occurred!" });
});

module.exports = app;
