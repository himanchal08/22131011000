const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const logger = require("./middlewares/logger");
// const routes = require('./routes');

const shortUrlRoutes = require("./routes/shortUrlRoutes");
const shortUrlController = require("./controllers/shortUrlController");

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use(logger);

app.use("/api", shortUrlRoutes);

app.get("/:shortcode", shortUrlController.redirectShortUrl);

module.exports = app;

