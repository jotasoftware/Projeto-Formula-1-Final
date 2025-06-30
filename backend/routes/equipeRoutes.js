const express = require('express');
const router = express.Router();
const Equipe = require('../models/Equipe');
const redisClient = require('../config/redis');

const logger = require('../config/logger')

const { body, validationResult } = require('express-validator');
const authMiddleware = require('../config/authMiddleware');

router.post('/', authMiddleware,[
    body('nome').notEmpty().withMessage('Nome é obrigatório').escape(),
    body('nacionalidade').notEmpty().withMessage('Nacionalidade é obrigatória').escape(),
    body('vitorias').notEmpty().withMessage('Vitórias são obrigatórias').isInt({ min: 0 }).withMessage('Vitórias deve ser um número inteiro positivo'),
    body('pontos').notEmpty().withMessage('Pontos são obrigatórios').isFloat({ min: 0 }).withMessage('Pontos deve ser um número válido'),
    body('temporada').notEmpty().withMessage('Temporada é obrigatória').isInt({ min: 1900 }).withMessage('Temporada deve ser um ano válido')
], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        logger.warn(`Campos na criação de equipes faltando ou inválidos.`);
        return res.status(400).json({ errors: errors.array() });
    }
    
    const {nome, nacionalidade, vitorias, pontos, temporada} = req.body;
    if(!nome || !nacionalidade){
        logger.warn(`Campos na criação de equipes faltando.`);
        return res.status(400).json({message: 'Campos obrigatórios faltando'});
    }

    try{
        const novaEquipe = await Equipe.create({
        nome,
        nacionalidade,
        vitorias: vitorias || 0,
        pontos: pontos || 0,
        temporada
    })
        await redisClient.del(`equipes:${temporada}`);
        logger.info(`Equipe criada com sucesso: ${novaEquipe}`);
        res.status(201).json(novaEquipe);
    }catch (error){
        logger.error(`Erro ao criar equipe: ${novaEquipe} - erro: ${error.message}`);
        console.error('Erro ao criar equipe:', error);
        res.status(500).json({message: 'Erro ao criar equipe'});
    }
})

router.get('/', async (req, res) => {
    const { temporada } = req.query;
    const cacheKey = `equipes:${temporada}`;
    try {
        const cached = await redisClient.get(cacheKey);
        if(cached){
            logger.info(`Dados de busca em cache de equipes efetuados com sucesso na temporada: ${temporada}`);
            return res.json(JSON.parse(cached));
        }
        const where = temporada ? { temporada } : {};
        const equipes = await Equipe.findAll({ where, order: [['pontos', 'DESC']] });
        logger.info(`Busca de ${equipes.length} equipes efetuadas com sucesso na temporada: ${temporada}`);

        await redisClient.set(cacheKey, JSON.stringify(equipes), {
            EX: 60 * 10,
        })
        
        res.json(equipes);
    }catch (error){
        logger.error(`Erro ao buscar equipes na temportada: ${temporada} - erro: ${error.message}`);
        console.error('Erro ao buscar equipes:', error);
        res.status(500).json({message: 'Erro ao buscar equipes'});
    }
})

router.patch('/:id', authMiddleware, async (req, res) => {
    const {id} = req.params;
    const updates = req.body;
    const { yearSeason } = req.body;

    try {
        const equipe = await Equipe.findByPk(id);
        if (!equipe){
            return res.status(404).json({ message: 'Equipe não encontrada' });
        }

        await equipe.update(updates);
        await redisClient.del(`equipes:${yearSeason}`);
        logger.info(`Edição de pontos na ${equipe} efetuada com sucesso.`);
        res.json(equipe);
    }catch (error){
        logger.error(`Erro ao atualizar equipes - erro: ${error.message}`);
        console.error('Erro ao atualizar equipe:', error);
        res.status(500).json({message: 'Erro ao atualizar equipe'});
    }
})

module.exports = router;
