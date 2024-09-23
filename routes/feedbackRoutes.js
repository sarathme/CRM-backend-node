// Packages imports
const express = require("express");

// Internal imports

const feedbackController = require("./../controllers/feedbackController");

const router = express.Router();

router.route("/").get(feedbackController.getAllFeedbacks);

module.exports = router;
