const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Corrida = sequelize.define('Corrida', {
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    data: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    circuito: {
        type: DataTypes.STRING,
        allowNull: false
    },
    latitude: {
        type: DataTypes.STRING,
        allowNull: false
    },
    longitude: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, {
    tableName: 'corridas',
    timestamps: false
});

module.exports = Corrida;
