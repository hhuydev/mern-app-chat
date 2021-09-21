const express = require("express");
const db = require("./db/connect-db");
const route = require("./routers/index.route");
const morgan = require("morgan");

const app = express();

db.connect();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("common"));

route(app);

module.exports = app;
