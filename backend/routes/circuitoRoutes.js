const express = require('express');
const Circuito = require('../models/Circuito');
const { Op } = require('sequelize');
const redisClient = require('../config/redis');

const authMiddleware = require('../config/authMiddleware');

const router = express.Router();

const logger = require('../config/logger')

const { body, validationResult } = require('express-validator');

router.post('/', authMiddleware,[
        body('nome').notEmpty().withMessage('Nome é obrigatório').escape(),
        body('data').notEmpty().withMessage('Data é obrigatória').isISO8601().withMessage('Formato de data inválido').toDate(),
        body('circuito').notEmpty().withMessage('Circuito é obrigatório').escape(),
        body('latitude').notEmpty().withMessage('Latitude é obrigatória').isFloat({ min: -90, max: 90 }).withMessage('Latitude inválida').toFloat(),
        body('longitude').notEmpty().withMessage('Longitude é obrigatória').isFloat({ min: -180, max: 180 }).withMessage('Longitude inválida').toFloat()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        logger.warn(`Campos na criação de circuitos faltando.`);
        return res.status(400).json({ errors: errors.array() });
    } 
        
    const {nome, data, circuito, latitude, longitude, temporada} = req.body;

    try {
        const novoCircuito = await Circuito.create({
            nome,
            data,
            circuito,
            latitude,
            longitude,
            temporada
        })
        await redisClient.del(`circuitos:${temporada}`);
        logger.info(`Circuito criado com sucesso: ${circuito}`);
        res.status(201).json(novoCircuito);
    } catch (error) {
        logger.error(`Erro ao criar circuito: ${circuito} - erro: ${error.message}`);
        console.error('Erro ao criar circuito:', error);
        res.status(500).json({message: 'Erro ao criar circuito'});
    }
})

router.get('/', async (req, res) => {
    const { temporada } = req.query;
    const cacheKey = `circuitos:${temporada}`;
    try {
        const cached = await redisClient.get(cacheKey);
        if(cached){
            logger.info(`Dados de busca em cache de circuitos efetuados com sucesso na temporada: ${temporada}`);
            return res.json(JSON.parse(cached));
        }
        let where = {};
        if (temporada) {
            const startDate = `${temporada}-01-01`;
            const endDate = `${temporada}-12-31`;
            where.data = {
                [Op.between]: [startDate, endDate]
            };
        }
        const circuitos = await Circuito.findAll({ where });
        logger.info(`Busca de ${circuitos.length} circuitos efetuados com sucesso na temporada: ${temporada}`);

        await redisClient.set(cacheKey, JSON.stringify(circuitos), {
            EX: 60 * 10,
        })
        
        res.json(circuitos);
    } catch (error) {
        logger.error(`Erro ao buscar circuito na temportada: ${temporada} - erro: ${error.message}`);
        console.error('Erro ao buscar circuitos:', error);
        res.status(500).json({message: 'Erro ao buscar circuitos'});
    }
})

module.exports = router;
