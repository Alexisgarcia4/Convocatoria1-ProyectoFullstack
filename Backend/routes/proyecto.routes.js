module.exports = (app) => {
  const proyectos = require("../controllers/proyecto.controller");
  var router = require("express").Router();

  const autorizacion = require("../middleware/check-auth"); 

  // Obtener todos los proyectos de un usuario específico
  router.get("/usuario/:usuarioId", proyectos.findAllByUser); 

  // Obtener un proyecto por su ID
  router.get("/:id", proyectos.findOne); 

  // Aplicar autorizacion a todas las rutas definidas después de este middleware
  router.use(autorizacion);

  // Crear un nuevo proyecto
  router.post("/", proyectos.create);

  // Actualizar un proyecto por ID
  router.put("/:id", proyectos.update);

  // Eliminar un proyecto por ID
  router.delete("/:id", proyectos.delete);

  // Usa las rutas bajo el prefijo /api/proyectos
  app.use("/api/proyectos", router);
};
