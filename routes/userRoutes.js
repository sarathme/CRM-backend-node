const express = require("express");

const authController = require("./../controllers/authController");
const userController = require("./../controllers/userController");

const router = express.Router();

router.route("/login").post(authController.loginUser);

// User data access routes

router.use(authController.protect);

router
  .route("/")
  .get(authController.restrictTo("admin"), userController.getAllUsers)
  .post(
    authController.restrictTo("admin", "manager"),
    userController.createUser
  );
router.route("/:userId").get(userController.getUser);

module.exports = router;
