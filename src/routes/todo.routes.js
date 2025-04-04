const express = require("express");
const router = express.Router();
const TodoController = require("../controllers/todo.controller");
const authenticate = require("../middleware/auth.middleware");

router.post("/", authenticate, TodoController.create);
router.get("/", authenticate, TodoController.getAll);
router.put("/:id", authenticate, TodoController.update);
router.delete("/:id", authenticate, TodoController.delete);

module.exports = router;
