// Packages imports
const express = require("express");

// Internal imports

const queryController = require("./../controllers/queryController");

const router = express.Router();

router.route("/").get(queryController.getAllQueries);
router.route("/stats").get(queryController.getQueryStats);

module.exports = router;
