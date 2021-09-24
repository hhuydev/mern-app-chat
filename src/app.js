const express = require("express");
require("./db/connect-db");
const route = require("./routers/index.route");
const morgan = require("morgan");

const app = express();

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

/**Su dung middleware error default cho express cung cap khi co bat cu loi nao cac route */
app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.send({ message: error.message || "An unknown error occurred!" });
});

module.exports = app;
