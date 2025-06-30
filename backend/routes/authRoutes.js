const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {jwtSecret } = require('../config/env');
const Usuario = require('../models/Usuario');
const rateLimit = require('express-rate-limit');
const redisClient = require('../config/redis');

const logger = require('../config/logger')

const { body, validationResult } = require('express-validator');

const router = express.Router();

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 3,
    message: 'Muitas tentativas de login. Tente novamente em 15 minutos.',
    standardHeaders: true,
    legacyHeaders: false,
  });
  

router.post('/login', loginLimiter, [
    body('email').isEmail().withMessage('Email invalido'),
    body('senha').notEmpty().withMessage('Senha obrigatoria'),
], async (req, res) => {
    const {email, senha} = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.warn(`Tentativa com dados que não eram certos: ${email}`);
        return res.status(400).json({ errors: errors.array() });
    }
  
    try {
        const usuario = await Usuario.findOne({where: {email}})
        const senhaString = await bcrypt.compare(senha, usuario.senhaHash)

        if (!usuario || !senhaString) {
            logger.warn(`Tentativa com dados invalidos: ${email}`);
            return res.status(401).json({message: 'Dados invalidos'})
        }

        const token = jwt.sign({id: usuario.id}, jwtSecret, {expiresIn: '1h'})

        logger.info(`Usuário logado com sucesso: ${email}`);
        res.json({token})
    }catch (error) {
        logger.error(`Erro ao logar usuário: ${email} - erro: ${error.message}`);
        console.error('Erro no login:', error);
        res.status(500).json({message: 'Erro ao fazer login'});
    }
})

router.post('/create', [
    body('email').isEmail().withMessage('Email inválido'),
    body('senha').isLength({ min: 6 }).withMessage('Senha deve ter ao menos 6 caracteres'),
], async (req, res) => {
    const {email, senha} = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try{
        const existe = await Usuario.findOne({where: {email}})
        if(existe) {
            logger.warn(`Tentativa de criação de usuário duplicado: ${email}`);
            return res.status(400).json({message: 'Ja existe esse usuario' })
        }
        const senhaHash = await bcrypt.hash(senha, 10)
        const novo = await Usuario.create({email, senhaHash})

        const token = jwt.sign({id: novo.id}, jwtSecret, {expiresIn: '1h'})

        logger.info(`Usuário criado com sucesso: ${novo.id} - : ${email}`);
        res.status(201).json({message: 'Usuário criado com sucesso', token})
    }catch (error){
        logger.error(`Erro ao criar usuário: ${email} - erro: ${error.message}`);
        res.status(500).json({message: 'Erro ao criar usuario', erro: error.message})
    }
})

router.post('/logout', async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'Token não fornecido' });

    const token = authHeader.split(' ')[1];

    try {
    const decoded = jwt.decode(token);
    if (!decoded) {
        return res.status(400).json({ message: 'Token inválido' });
    }

    const exp = decoded.exp;
    const now = Math.floor(Date.now() / 1000);
    const ttl = exp - now;

    if (ttl > 0) {
        await redisClient.set(`bl_${token}`, token, { EX: ttl });
    }
    logger.info(`Logout realizado com sucesso e token adicionado a blacklist: ${token}`);
    res.json({ message: 'Logout realizado com sucesso' });
    } catch (error) {
        res.status(500).json({ message: 'Erro no logout' });
    }
})
  

module.exports = router;
