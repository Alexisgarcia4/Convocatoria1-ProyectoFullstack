
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Proyecto = sequelize.define('Proyecto', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
      
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    usuarioId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Usuarios',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
  }, {
    tableName: 'Proyectos',
    timestamps: true,
  });

  return Proyecto;
};
