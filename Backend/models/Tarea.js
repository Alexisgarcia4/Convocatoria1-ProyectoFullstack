
const { DataTypes } = require('sequelize');


module.exports = (sequelize) => {
  const Tarea = sequelize.define('Tarea', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    mensaje: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    prioridad: {
      type: DataTypes.ENUM('alta', 'media', 'baja'),
      allowNull: false,
      defaultValue: 'media',
    },
    hecha: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    
    foto: {
      type: DataTypes.STRING, 
      allowNull: true,
    },
    proyectoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Proyectos',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
  }, {
    tableName: 'Tareas',
    timestamps: true,
  });

  return Tarea;
};