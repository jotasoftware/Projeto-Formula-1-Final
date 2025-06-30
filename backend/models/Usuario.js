const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');

const Usuario = sequelize.define('Usuario', {
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  senhaHash: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'usuarios',
  timestamps: false
})

module.exports = Usuario;
