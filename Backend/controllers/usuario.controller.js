
const db = require("../models");
const Usuario = db.Usuario;
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken');
const Op = db.Sequelize.Op;

// Crear un nuevo usuario (Registro)
exports.create = async (req, res) => {
  const { nombre, correo, contrasena } = req.body;

  try {
    // Validar que el correo no exista previamente
    const usuarioExistente = await Usuario.findOne({ where: { correo } });

    if (usuarioExistente) {
      return res.status(400).send({ message: "El correo ya está en uso." });
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(contrasena, 12);

    // Crear el usuario si no existe
    const usuario = {
      nombre,
      correo,
      contrasena: hashedPassword,
    };

    const data = await Usuario.create(usuario);

    // Generar el token JWT
    let token;
    try {
      token = jwt.sign(
        { userId: data.id, email: data.correo }, // Usar los datos del usuario creado
        'clave_secreta', 
        { expiresIn: '1h' } // Configurar la expiración del token
      );
    } catch (error) {
      return res.status(500).send({ message: "Error al generar el token." });
    }

    // Devolver el usuario creado junto con el token
    res.status(201).json({
      id: data.id,
      nombre: data.nombre,
      correo: data.correo,
      token: token
    });
  } catch (err) {
    res.status(500).send({ message: err.message || "Error al crear el usuario." });
  }
};

// Iniciar sesión (Login)
exports.login = async (req, res) => {
  const { correo, contrasena } = req.body;

  try {
    // Buscar al usuario por correo
    const usuario = await Usuario.findOne({ where: { correo } });

    if (!usuario) {
      return res.status(404).send({ message: "Usuario no encontrado." });
    }

    // Comparar la contraseña ingresada con la almacenada en la base de datos (encriptada)
    const isPasswordValid = await bcrypt.compare(contrasena, usuario.contrasena);
    
    if (!isPasswordValid) {
      return res.status(401).send({ message: "Contraseña incorrecta." });
    }

    // Generar el token JWT si la contraseña es válida
    let token;
    try {
      token = jwt.sign(
        { userId: usuario.id, email: usuario.correo },
        "clave_secreta", 
        { expiresIn: "1h" } 
      );
    } catch (error) {
      return res.status(500).send({ message: "Error al generar el token." });
    }

    // Si todo es correcto, devolver los datos del usuario junto con el token
    return res.status(200).json({
      mensaje: "Inicio de sesión exitoso.",
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo,
      },
      token: token, // Devolver el token al cliente
    });
    
  } catch (err) {
    return res.status(500).send({ message: err.message || "Error al iniciar sesión." });
  }
};


// Obtener todos los usuarios
exports.findAll = (req, res) => {
  Usuario.findAll()
    .then((usuarios) => {
      res.status(200).send(usuarios);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error al obtener los usuarios.",
      });
    });
};

// Obtener los datos del usuario por ID
exports.findOne = (req, res) => {
  const id = req.params.id;

  Usuario.findByPk(id)
    .then((usuario) => {
      if (!usuario) {
        return res
          .status(404)
          .send({ message: `Usuario con id=${id} no encontrado.` });
      }

      // Devolver los datos del usuario
      res.status(200).send({
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo,
      });
    })
    .catch((err) =>
      res
        .status(500)
        .send({
          message: err.message || `Error al obtener el usuario con id=${id}.`,
        })
    );
};

// Actualizar un usuario por ID
exports.update = async (req, res) => {
  const idUsuario = req.params.id;
  const usuarioId = req.userData.userId; // Obtenemos el usuario autenticado del token

  if (idUsuario != usuarioId) {
    return res.status(403).send({ message: "No tienes permiso para modificar este perfil." });
  }

  try {
    const updatedData = { ...req.body };

    // Si el correo está en el cuerpo de la solicitud, comprobar si ya está en uso por otro usuario
    if (req.body.correo) {
      const correoEnUso = await Usuario.findOne({
        where: {
          correo: req.body.correo,  // Buscar usuarios con el mismo correo
          id: { [Op.ne]: idUsuario }  // Excepto el mismo usuario que se está actualizando
        }
      });

      // Si el correo está en uso por otro usuario
      if (correoEnUso) {
        return res.status(400).send({ message: "El correo ya está en uso. Por favor, elige otro." });
      }
    }

    // Si la contraseña está en el cuerpo de la solicitud, encriptarla
    if (req.body.contrasena) {
      const hashedPassword = await bcrypt.hash(req.body.contrasena, 12);
      updatedData.contrasena = hashedPassword; // Reemplazar la contraseña en el objeto de datos a actualizar
    }

    // Realizar la actualización del usuario
    await Usuario.update(updatedData, { where: { id: idUsuario } });
    
    res.send({ message: "Usuario actualizado correctamente." });
  } catch (err) {
    res.status(500).send({ message: "Error al actualizar el usuario." });
  }
};

// Eliminar un usuario por ID
exports.delete = async (req, res) => {
  const idUsuario = req.params.id;
  const usuarioId = req.userData.userId; // Obtenemos el usuario autenticado del token

  if (idUsuario != usuarioId) {
    return res.status(403).send({ message: "No tienes permiso para eliminar este perfil." });
  }

  try {
    await Usuario.destroy({ where: { id: idUsuario } });
    res.send({ message: "Usuario eliminado correctamente." });
  } catch (err) {
    res.status(500).send({ message: "Error al eliminar el usuario." });
  }
};
