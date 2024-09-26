const express = require("express");

const productController = require("./../controllers/productController");

const router = express.Router();

router.route("/").get(productController.getAllProducts);
router.route("/stats").get(productController.getProductStats);
router.route("/:productId").get(productController.getProduct);

module.exports = router;
