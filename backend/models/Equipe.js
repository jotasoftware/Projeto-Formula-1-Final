const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Equipe = sequelize.define('Equipe', {
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    nacionalidade: {
        type: DataTypes.STRING,
        allowNull: false
    },
    vitorias: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    pontos: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    temporada: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'equipes',
    timestamps: false
});

module.exports = Equipe;
