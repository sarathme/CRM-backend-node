// Packages imports
const express = require("express");

// Internal imports

const customerController = require("./../controllers/customerController");
const authController = require("./../controllers/authController");

const router = express.Router();

router.use(authController.protect);
router
  .route("/stats")
  .get(customerController.getSourceStats, customerController.getAllCustomers);

router.route("/").get(customerController.getAllCustomers);
router.route("/:customerId").get(customerController.getCustomer);

module.exports = router;
