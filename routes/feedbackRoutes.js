// Packages imports
const express = require("express");

// Internal imports

const feedbackController = require("./../controllers/feedbackController");
const authController = require("./../controllers/authController");

const router = express.Router();

router.use(authController.protect);

router.route("/").get(feedbackController.getAllFeedbacks);
router.route("/stats").get(feedbackController.getFeedbackStats);

module.exports = router;
