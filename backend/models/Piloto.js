const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Piloto = sequelize.define('Piloto', {
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    numero: {
        type: DataTypes.INTEGER,
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
    equipe: {
        type: DataTypes.STRING,
        allowNull: false
    },
    pontos: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    nascimento: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    link: {
        type: DataTypes.STRING,
        allowNull: false
    },
    temporada: {
        type: DataTypes.INTEGER,
        allowNull: false
    }   
}, {
  tableName: 'pilotos',
  timestamps: false
});

module.exports = Piloto;
