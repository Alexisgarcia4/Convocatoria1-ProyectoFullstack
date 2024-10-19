module.exports = (app) => {
  const usuarios = require("../controllers/usuario.controller");

  var router = require("express").Router();

  const autorizacion = require("../middleware/check-auth"); // (1) Importamos middleware

  // Obtener todos los usuarios
  router.get("/", usuarios.findAll);

  // Obtener un usuario por ID
  router.get("/:id", usuarios.findOne);

  // Crear un nuevo usuario (registro)
  router.post("/", usuarios.create);

  // Iniciar sesión (login)
  router.post("/login", usuarios.login);

  // Aplicar autorizacion a todas las rutas definidas después de este middleware
  router.use(autorizacion);

  // Actualizar un usuario por ID
  router.put("/:id", usuarios.update);

  // Eliminar un usuario por ID
  router.delete("/:id", usuarios.delete);

  app.use("/api/usuarios", router);
};
