const express = require('express');
const router = express.Router();
const Piloto = require('../models/Piloto');
const redisClient = require('../config/redis');

const logger = require('../config/logger')

const { body, validationResult } = require('express-validator');
const authMiddleware = require('../config/authMiddleware');

router.post('/', authMiddleware, [
    body('nome').notEmpty().withMessage('Nome é obrigatório').escape(),
    body('numero').notEmpty().withMessage('Número é obrigatório').isInt({ min: 0 }).withMessage('Número deve ser um inteiro positivo'),
    body('vitorias').optional().isInt({ min: 0 }).withMessage('Vitórias deve ser um número inteiro positivo'),
    body('equipe').notEmpty().withMessage('Equipe é obrigatória').escape(),
    body('pontos').optional().isFloat({ min: 0 }).withMessage('Pontos deve ser um número válido'),
    body('nascimento').notEmpty().withMessage('Data de nascimento é obrigatória').isISO8601().withMessage('Formato de data inválido').toDate(),
    body('link').optional().isURL().withMessage('Link deve ser uma URL válida'),
    body('temporada').optional().isInt({ min: 1900 }).withMessage('Temporada deve ser um ano válido'),
    body('nacionalidade').optional().escape()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.warn('Campos na criação de pilotos faltando ou inválidos.');
        return res.status(400).json({ errors: errors.array() });
    }

    const { nome, numero, vitorias, equipe, pontos, nascimento, link, temporada, nacionalidade } = req.body;

    try{
        const novoPiloto = await Piloto.create({
            nome,
            numero,
            vitorias: vitorias || 0,
            equipe,
            pontos: pontos || 0,
            nascimento,
            link: link || '',
            temporada, 
            nacionalidade
        })
        console.log(novoPiloto)
        await redisClient.del(`pilotos:${temporada}`);
        logger.info(`Piloto criado com sucesso: ${nome}`);
        res.status(201).json(novoPiloto);
    }catch(error){
        logger.error(`Erro ao criar piloto: ${novoPiloto} - erro: ${error.message}`);
        console.error('Erro ao criar piloto:', error);
        res.status(500).json({message: 'Erro ao criar piloto'});
    }
})

router.get('/', async (req, res) => {
    const { temporada } = req.query;
    const cacheKey = `pilotos:${temporada}`;
    try {
        const cached = await redisClient.get(cacheKey);
        if(cached){
            logger.info(`Dados de busca em cache de pilotos efetuados com sucesso na temporada: ${temporada}`);
            return res.json(JSON.parse(cached));
        }
        const where = temporada ? { temporada } : {};
        const pilotos = await Piloto.findAll({ where, order: [['pontos', 'DESC']] });
        logger.info(`Busca de ${pilotos.length} pilotos efetuadas com sucesso na temporada: ${temporada}`);

        await redisClient.set(cacheKey, JSON.stringify(pilotos), {
            EX: 60 * 10,
        })

        res.json(pilotos);
    }catch(error){
        logger.error(`Erro ao buscar pilotos na temportada: ${temporada} - erro: ${error.message}`);
        console.error('Erro ao buscar pilotos:', error);
        res.status(500).json({message: 'Erro ao buscar pilotos'});
    }
})

router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const piloto = await Piloto.findByPk(id);
        if(!piloto){
            logger.warn(`Piloto com o nº ${id} não encontrado.`);
            return res.status(404).json({ message: 'Piloto não encontrado' });
        }
        logger.info(`Busca do piloto: ${piloto} efetuada com sucesso.`);
        res.json(piloto);
    } catch (error) {
        logger.error(`Erro ao buscar o piloto com o nº ${id} - erro: ${error.message}`);
        console.error('Erro ao buscar piloto:', error);
        res.status(500).json({ message: 'Erro ao buscar piloto' });
    }
})
  

router.patch('/:id', authMiddleware, async (req, res) => {
    const {id} = req.params;
    const updates = req.body;
    const { yearSeason } = req.body;

    try{
        const piloto = await Piloto.findByPk(id);
        if(!piloto){
            return res.status(404).json({message: 'Piloto não encontrado'});
        }

        await piloto.update(updates);
        await redisClient.del(`pilotos:${yearSeason}`);
        logger.info(`Edição de pontos no ${piloto} efetuada com sucesso.`);
        res.json(piloto);
    }catch(error){
        logger.error(`Erro ao atualizar pilotos - erro: ${error.message}`);
        console.error('Erro ao atualizar piloto:', error);
        res.status(500).json({message: 'Erro ao atualizar piloto'});
    }
})

module.exports = router;
