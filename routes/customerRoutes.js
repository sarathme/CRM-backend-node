// Packages imports
const express = require("express");

// Internal imports

const customerController = require("./../controllers/customerController");

const router = express.Router();
router
  .route("/stats")
  .get(customerController.getSourceStats, customerController.getAllCustomers);

router.route("/").get(customerController.getAllCustomers);
router.route("/:customerId").get(customerController.getCustomer);

module.exports = router;
