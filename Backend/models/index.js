
const Sequelize = require('sequelize');
const dbConfig = require('../config/db.config'); // Importa tu configuración de base de datos

// Crear la conexión con la base de datos MySQL
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

// Crear el objeto `db` que contendrá los modelos y la conexión
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// models/index.js
db.Usuario = require('./Usuario.js')(sequelize, Sequelize);
db.Proyecto = require('./Proyecto.js')(sequelize, Sequelize);  
db.Tarea = require('./Tarea.js')(sequelize, Sequelize);

// Relaciones
db.Usuario.hasMany(db.Proyecto, { foreignKey: 'usuarioId', onDelete: 'CASCADE', as: 'proyectos' });
db.Proyecto.belongsTo(db.Usuario, { foreignKey: 'usuarioId', as: 'usuario' });

db.Proyecto.hasMany(db.Tarea, { foreignKey: 'proyectoId', onDelete: 'CASCADE', as: 'tareas' });
db.Tarea.belongsTo(db.Proyecto, { foreignKey: 'proyectoId', as: 'proyecto' });

module.exports = db;
