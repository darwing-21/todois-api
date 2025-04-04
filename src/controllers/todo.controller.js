const { Todo, User } = require("../database/models");

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
      let todos;

      const includeUser = {
        model: User,
        as: "user",
        attributes: ["id", "name", "last_name"],
      };

      if (req.user.role === "admin") {
        todos = await Todo.findAll({ include: [includeUser] });
      } else {
        todos = await Todo.findAll({
          where: { user_id: req.user.id },
          include: [includeUser],
        });
      }

      const response = todos.map((todo) => ({
        id: todo.id,
        title: todo.title,
        description: todo.description,
        completed: todo.completed,
        user_id: todo.user.id,
        user: `${todo.user.name} ${todo.user.last_name}`,
        createdAt: todo.createdAt,
        updatedAt: todo.updatedAt,
      }));

      return res.json(response);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const { title, description, completed } = req.body;

      const todo = await Todo.findByPk(id);

      if (!todo) return res.status(404).json({ message: "Todo not found" });

      if (req.user.role === "admin") {
        return res.status(403).json({ message: "Admins cannot edit todos" });
      }

      if (todo.user_id !== req.user.id) {
        return res.status(403).json({ message: "Not your todo" });
      }

      await todo.update({ title, description, completed });
      return res.json(todo);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;

      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Only admin can delete todos" });
      }

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
