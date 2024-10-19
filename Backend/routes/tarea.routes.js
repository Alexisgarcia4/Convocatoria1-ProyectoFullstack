module.exports = (app) => {
  const tareas = require("../controllers/tarea.controller");
  const autorizacion = require("../middleware/check-auth");
  const multer = require("multer");
  const upload = multer({ dest: "./uploads" }); // Destino para las imágenes subidas

  var router = require("express").Router();

  // Obtener todas las tareas de un proyecto específico con filtros opcionales
  router.get("/proyecto/:proyectoId", tareas.findAllByProject);

  // Obtener una tarea por ID
  router.get("/:id", tareas.findOne);

  // Aplicar autorizacion a todas las rutas definidas después de este middleware
  router.use(autorizacion);

  // Crear una nueva tarea
  router.post("/", upload.single("foto"), tareas.create);

  // Actualizar una tarea por ID
  router.put("/:id", upload.single("foto"), tareas.update);

  // Eliminar una tarea por ID
  router.delete("/:id", tareas.delete);

  // Eliminar la imagen de una tarea por ID
  router.put("/:id/eliminarfoto", tareas.eliminarFoto);

  app.use("/api/tareas", router);
};
