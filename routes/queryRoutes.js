// Packages imports
const express = require("express");

// Internal imports

const queryController = require("./../controllers/queryController");
const authController = require("./../controllers/authController");

const router = express.Router();

router.use(authController.protect);

router.route("/").get(queryController.getAllQueries);
router.route("/stats").get(queryController.getQueryStats);

module.exports = router;
