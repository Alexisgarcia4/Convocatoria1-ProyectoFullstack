// Importar las librerías necesarias
const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");

// Configuración CORS (opcional)
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración para servir archivos estáticos desde la carpeta 'uploads'
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Importar la base de datos y sincronizar
const db = require("./models");

db.sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Sincronización exitosa con la base de datos.");
  })
  .catch((err) => {
    console.log("Error al sincronizar la base de datos:", err);
  });

// Configurar el puerto
const PORT = 8080;

// Ruta GET simple
app.get("/", (req, res) => {
  res.json({ message: "¡Hola, API de Usuarios y Tareas funcionando!" });
});

// Importar las rutas de Usuarios y Tareas
require("./routes/usuario.routes")(app); // Rutas para Usuarios

require("./routes/tarea.routes")(app); // Rutas para Tareas

require("./routes/proyecto.routes")(app); // Rutas para proyectos

// Iniciar el servidor
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
