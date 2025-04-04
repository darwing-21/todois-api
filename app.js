require("dotenv").config();
const express = require("express");
const routes = require("./src/routes");
const { sequelize } = require("./src/database/models");

const app = express();

app.use(express.json());

app.use("/api", routes);

const PORT = process.env.PORT || 3000;

sequelize
  .sync({ force: false }) 
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error al sincronizar la base de datos:", error);
  });
