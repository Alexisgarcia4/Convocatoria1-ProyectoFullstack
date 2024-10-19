
const { DataTypes } = require('sequelize');



module.exports = (sequelize) => {
  const Usuario = sequelize.define('Usuario', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    correo: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    contrasena: {
      type: DataTypes.STRING(100),
      allowNull: false,  
    },
  }, {
    tableName: 'Usuarios',
    timestamps: true,
  });

  return Usuario;
};
