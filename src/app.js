const express = require("express");
require("./db/connect-db");
const route = require("./routers/index.route");
const morgan = require("morgan");

const app = express();

/**config = middleware */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("combined"));

route(app);

module.exports = app;
