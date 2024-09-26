const express = require("express");

const productController = require("./../controllers/productController");
const authController = require("./../controllers/authController");

const router = express.Router();

router.use(authController.protect);

router.route("/").get(productController.getAllProducts);
router.route("/stats").get(productController.getProductStats);
router.route("/:productId").get(productController.getProduct);

module.exports = router;
