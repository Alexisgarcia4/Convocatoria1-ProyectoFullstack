
const db = require('../models');
const Proyecto = db.Proyecto;
const Op = db.Sequelize.Op;



// Crear un nuevo proyecto
exports.create = (req, res) => {
  const { nombre, descripcion, usuarioId } = req.body;

  // Verificar si ya existe un proyecto con el mismo nombre para el mismo usuario
  Proyecto.findOne({ where: { nombre, usuarioId } })
    .then(proyectoExistente => {
      if (proyectoExistente) {
        return res.status(400).send({ message: 'Ya tienes un proyecto con ese nombre.' });
      }

      // Si no existe, crear el proyecto
      Proyecto.create({ nombre, descripcion, usuarioId })
        .then(proyecto => res.status(201).send(proyecto))
        .catch(err => res.status(500).send({ message: err.message || 'Error al crear el proyecto.' }));
    })
    .catch(err => res.status(500).send({ message: err.message || 'Error al verificar el proyecto.' }));
};



// Obtener todos los proyectos de un usuario
exports.findAllByUser = (req, res) => {
  const usuarioId = req.params.usuarioId;

  Proyecto.findAll({ where: { usuarioId } })
    .then(proyectos => {
      // Devuelve el array vacío si no hay proyectos, con estado 200
      res.status(200).send(proyectos);
    })
    .catch(err => res.status(500).send({ message: err.message || 'Error al obtener los proyectos del usuario.' }));
};


// Actualizar un proyecto por ID
exports.update = async (req, res) => {
  const idProyecto = req.params.id;
  const usuarioId = req.userData.userId; // Obtenemos el usuario autenticado del token

  try {
    // Buscar el proyecto por ID y comprobar si pertenece al usuario
    const proyecto = await Proyecto.findOne({ where: { id: idProyecto, usuarioId } });
    
    if (!proyecto) {
      return res.status(403).send({ message: "No tienes permiso para modificar este proyecto." });
    }

    // Comprobar si el nombre ya está en uso por otro proyecto del mismo usuario
    if (req.body.nombre) {
      const nombreEnUso = await Proyecto.findOne({
        where: {
          nombre: req.body.nombre,
          usuarioId: usuarioId, 
          id: { [Op.ne]: idProyecto }  
        }
      });

      // Si el nombre está en uso por otro proyecto
      if (nombreEnUso) {
        return res.status(400).send({ message: "El nombre ya está en uso. Por favor, elige otro." });
      }
    }

    // Si el proyecto pertenece al usuario, proceder a la actualización
    await Proyecto.update(req.body, { where: { id: idProyecto } });
    res.send({ message: "Proyecto actualizado correctamente." });
  } catch (err) {
    res.status(500).send({ message: "Error al actualizar el proyecto." });
  }
};

// Eliminar un proyecto por ID
exports.delete = async (req, res) => {
  const idProyecto = req.params.id;
  const usuarioId = req.userData.userId; // Obtenemos el usuario autenticado del token

  try {
    // Buscar el proyecto por ID y comprobar si pertenece al usuario
    const proyecto = await Proyecto.findOne({ where: { id: idProyecto, usuarioId } });

    if (!proyecto) {
      return res.status(403).send({ message: "No tienes permiso para eliminar este proyecto." });
    }

    // Si el proyecto pertenece al usuario, proceder a la eliminación
    await Proyecto.destroy({ where: { id: idProyecto } });
    res.send({ message: "Proyecto eliminado correctamente." });
  } catch (err) {
    res.status(500).send({ message: "Error al eliminar el proyecto." });
  }
};

// Obtener un proyecto por su ID
exports.findOne = (req, res) => {
  const id = req.params.id;

  Proyecto.findByPk(id)
    .then(proyecto => {
      if (!proyecto) {
        return res.status(404).send({ message: `No se encontró el proyecto con id=${id}.` });
      }
      res.status(200).send(proyecto);
    })
    .catch(err => res.status(500).send({ message: err.message || `Error al obtener el proyecto con id=${id}.` }));
};