const express = require("express");
const router = express.Router();
const shortUrlController = require("../controllers/shortUrlController");

router.post("/shorturls", shortUrlController.createShortUrl);

router.get("/shorturls/:shortcode", shortUrlController.getStats);

router.get("/shorturls", shortUrlController.getAllShortUrls);

router.get("/:shortcode", shortUrlController.redirectShortUrl);

module.exports = router;
