const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user.controller");
const authenticate = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");

router.get("/", authenticate, authorize("admin"), UserController.getAll);

module.exports = router;
