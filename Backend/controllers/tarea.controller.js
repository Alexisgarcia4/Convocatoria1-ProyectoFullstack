const db = require('../models');
const Tarea = db.Tarea;
const Usuario = db.Usuario;
const Proyecto = db.Proyecto;
const Op = db.Sequelize.Op;
const multer = require('multer');
const path = require('path');
const fs = require('fs'); // Importamos fs para eliminar archivos

// Configuración de Multer para almacenar imágenes en una carpeta específica
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads'); // Carpeta donde se guardarán las imágenes
  },
  filename: (req, file, cb) => {
    // Extraer la extensión del archivo utilizando path.extname()
    const ext = path.extname(file.originalname);
    // Generar un nombre único para la imagen
    cb(null, 'image-' + Date.now() + ext); // Usar la extensión obtenida
  }
});

// Filtro de archivos para asegurarnos de que solo se suban imágenes
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(new Error('Tipo de archivo no soportado'), false);
    }
  };
  
  // Inicializar Multer con la configuración anterior
  const upload = multer({
    storage: storage,
    limits: {
      fileSize: 1024 * 1024 * 5, // Limitar tamaño del archivo a 5MB
    },
    fileFilter: fileFilter
  });



  exports.create = (req, res) => {
    const { nombre, mensaje, prioridad, hecha, proyectoId } = req.body;
    const foto = req.file ? req.file.path : null; // Obtener la URL de la imagen subida

    // Verificar si ya existe una tarea con el mismo nombre en el proyecto
    Tarea.findOne({ where: { nombre, proyectoId } })
        .then(tareaExistente => {
            if (tareaExistente) {
                return res.status(400).send({ message: 'Ya tienes una tarea con ese nombre en este proyecto.' });
            }

            // Crear la tarea si no existe una con el mismo nombre
            return Tarea.create({ nombre, mensaje, prioridad, hecha, proyectoId, foto })
                .then(data => {
                    return res.status(201).send(data);
                });
        })
        .catch(err => {
            if (!res.headersSent) {
                return res.status(500).send({ message: err.message || 'Error al crear la tarea.' });
            }
        });
};


// Obtener una tarea por ID
exports.findOne = (req, res) => {
    const id = req.params.id;

    Tarea.findByPk(id)
        .then(data => {
            if (data) {
                res.status(200).send(data); 
            } else {
                res.status(404).send({
                    message: `No se encontró la tarea con id=${id}.`
                });
            }
        })
        .catch(err => res.status(500).send({
            message: err.message || `Error al buscar la tarea con id=${id}.`
        }));
};

// Obtener todas las tareas por proyecto
exports.findAllByProject = async (req, res) => {
    const proyectoId = req.params.proyectoId;
    const { prioridad, hecha, orden } = req.query;

    try {
        // Condición base: las tareas deben pertenecer al proyecto
        const condiciones = {
            proyectoId: proyectoId
        };

        // Agregar filtro por prioridad solo si está presente y no está vacío
        if (prioridad && prioridad.trim() !== '') {
            condiciones.prioridad = prioridad;
        }

        // Agregar filtro por "hecha" solo si está presente y no está vacío
        if (hecha && hecha.trim() !== '') {
            condiciones.hecha = (hecha === 'true');  // Convertimos el string "true" o "false" en booleano
        }

        // Configuración del orden; por defecto será ascendente
        let ordenFecha = [['createdAt', 'ASC']];  

        // Si el parámetro de orden está presente y es 'desc', cambiar el orden a descendente
        if (orden && orden.trim() !== '' && orden.toLowerCase() === 'desc') {
            ordenFecha = [['createdAt', 'DESC']];
        }

        // Buscar las tareas que coinciden con las condiciones y aplicar el orden
        const tareas = await Tarea.findAll({
            where: condiciones,
            order: ordenFecha
        });

        if (tareas.length > 0) {
            res.status(200).send(tareas); // Si hay tareas, devolverlas
        } else {
            res.status(200).send({
                message: `No se encontraron tareas para el proyecto con id=${proyectoId}`,
                data: []  // Enviar un array vacío si no se encuentran tareas
            });
        }
    } catch (err) {
        res.status(500).send({
            message: err.message || 'Error al obtener las tareas del proyecto.'
        });
    }
};



// Actualizar una tarea por ID
exports.update = async (req, res) => {
    const idTarea = req.params.id;
    const usuarioId = req.userData.userId; // Obtenemos el usuario autenticado del token
  
    try {
      // Buscar la tarea por ID
      const tarea = await Tarea.findByPk(idTarea);
      if (!tarea) {
        return res.status(404).json({ message: "Tarea no encontrada." });
      }
  
      // Obtener el proyecto al que pertenece la tarea
      const proyecto = await Proyecto.findByPk(tarea.proyectoId);
      if (!proyecto) {
        return res.status(404).json({ message: "Proyecto no encontrado." });
      }
  
      // Verificar si el proyecto pertenece al usuario autenticado
      if (proyecto.usuarioId !== usuarioId) {
        return res.status(403).json({ message: "No tienes permiso para modificar esta tarea." });
      }
  
      const { nombre, mensaje, prioridad, hecha } = req.body;
      let foto = tarea.foto; // Mantener la imagen actual si no se elimina ni se sube una nueva

      // Si se sube una nueva imagen, actualizar la ruta de la foto (esto reemplaza la imagen actual)
      if (req.file) {
        foto = req.file.path; // Usar la nueva imagen
      }

      // Comprobar si el nombre de la tarea ya está en uso dentro del mismo proyecto (excepto la tarea actual)
      if (nombre) {
        const nombreEnUso = await Tarea.findOne({
            where: {
                nombre,
                proyectoId: tarea.proyectoId,
                id: { [Op.ne]: idTarea } // Excluir la tarea actual de la búsqueda
            }
        });

        // Si el nombre está en uso por otra tarea
        if (nombreEnUso) {
            return res.status(400).send({ message: "El nombre ya está en uso para otra tarea en este proyecto. Por favor, elige otro." });
        }
      }

      // Actualizar la tarea, incluyendo el campo foto si se proporciona o manteniendo el anterior si no se ha modificado
      await tarea.update({ nombre, mensaje, prioridad, hecha, foto });

      res.status(200).json({ message: "Tarea actualizada exitosamente." });
    } catch (error) {
      res.status(500).json({ message: "Error al actualizar la tarea." });
    }
};



// Eliminar la foto de una tarea por ID
exports.eliminarFoto = async (req, res) => {
    const idTarea = req.params.id;
    const usuarioId = req.userData.userId; // Obtenemos el usuario autenticado del token
  
    try {
      // Buscar la tarea por ID
      const tarea = await Tarea.findByPk(idTarea);
      if (!tarea) {
        return res.status(404).json({ message: "Tarea no encontrada." });
      }
  
      // Obtener el proyecto al que pertenece la tarea
      const proyecto = await Proyecto.findByPk(tarea.proyectoId);
      if (!proyecto) {
        return res.status(404).json({ message: "Proyecto no encontrado." });
      }
  
      // Verificar si el proyecto pertenece al usuario autenticado
      if (proyecto.usuarioId !== usuarioId) {
        return res.status(403).json({ message: "No tienes permiso para eliminar la foto de esta tarea." });
      }
  
      // Si la tarea tiene una imagen asociada, eliminarla del servidor
      if (tarea.foto) {
        const imagePath = path.resolve(tarea.foto); // Convertir a ruta absoluta
  
        fs.unlink(imagePath, (err) => {
          if (err) {
            console.error("Error al eliminar la imagen:", err);
            return res.status(500).json({ message: "Error al eliminar la imagen." });
          } else {
            console.log("Imagen eliminada:", tarea.foto);
          }
        });
  
        // Actualizar el campo 'foto' a null en la base de datos
        await tarea.update({ foto: null });
  
        return res.status(200).json({ message: "Imagen eliminada correctamente." });
      } else {
        return res.status(400).json({ message: "No hay ninguna imagen para eliminar." });
      }
    } catch (error) {
      return res.status(500).json({ message: "Error al eliminar la imagen." });
    }
  };
  


// Eliminar una tarea por ID
exports.delete = async (req, res) => {
    const idTarea = req.params.id;
    const usuarioId = req.userData.userId; // Obtenemos el usuario autenticado del token
  
    try {
      // Buscar la tarea por ID
      const tarea = await Tarea.findByPk(idTarea);
      if (!tarea) {
        return res.status(404).send({ message: "Tarea no encontrada." });
      }
  
      // Obtener el proyecto al que pertenece la tarea
      const proyecto = await Proyecto.findByPk(tarea.proyectoId);
      if (!proyecto) {
        return res.status(404).send({ message: "Proyecto no encontrado." });
      }
  
      // Verificar si el proyecto pertenece al usuario autenticado
      if (proyecto.usuarioId !== usuarioId) {
        return res.status(403).send({ message: "No tienes permiso para eliminar esta tarea." });
      }
  
      // Si la tarea tiene una imagen asociada, eliminarla del servidor
      if (tarea.foto) {
        fs.unlink(tarea.foto, (err) => {
          if (err) {
            console.error("Error al eliminar la imagen:", err);
          } else {
            console.log("Imagen eliminada:", tarea.foto);
          }
        });
      }
  
      // Proceder a la eliminación de la tarea
      await Tarea.destroy({ where: { id: idTarea } });
      res.send({ message: "Tarea eliminada correctamente." });
    } catch (err) {
      res.status(500).send({ message: "Error al eliminar la tarea." });
    }
};

