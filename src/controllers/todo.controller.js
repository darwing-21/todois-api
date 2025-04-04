const { Todo } = require("../database/models");

class TodoController {
  async create(req, res) {
    try {
      const { title, description } = req.body;
      const todo = await Todo.create({
        user_id: req.user.id,
        title,
        description,
      });

      return res.status(201).json(todo);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async getAll(req, res) {
    try {
      const todos = await Todo.findAll({
        where: { user_id: req.user.id },
      });
      return res.json(todos);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const { title, description, completed } = req.body;

      const todo = await Todo.findOne({ where: { id, user_id: req.user.id } });

      if (!todo) return res.status(404).json({ message: "Todo not found" });

      await todo.update({ title, description, completed });

      return res.json(todo);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async delete(req, res) {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Only admin can delete todos" });
      }

      const { id } = req.params;
      const todo = await Todo.findByPk(id);

      if (!todo) return res.status(404).json({ message: "Todo not found" });

      await todo.destroy();
      return res.json({ message: "Todo deleted" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new TodoController();
