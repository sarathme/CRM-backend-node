const express = require("express");

const authController = require("./../controllers/authController");
const userController = require("./../controllers/userController");

const router = express.Router();

router.route("/login").post(authController.loginUser);

// User data access routes

router
  .route("/")
  .get(
    authController.protect,
    authController.restrictTo("admin"),
    userController.getAllUsers
  )
  .post(
    authController.protect,
    authController.restrictTo("admin", "manager"),
    userController.createUser
  );
router.route("/:userId").get(authController.protect, userController.getUser);

module.exports = router;
