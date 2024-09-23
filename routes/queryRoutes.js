// Packages imports
const express = require("express");

// Internal imports

const queryController = require("./../controllers/queryController");

const router = express.Router();

router.route("/").get(queryController.getAllQueries);

module.exports = router;
