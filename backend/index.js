const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const logger = require('./config/logger');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const morgan = require('morgan');
const https = require('https');
const compression = require('compression');

//models
const Usuario = require('./models/Usuario');
const Piloto = require('./models/Piloto');
const Equipe = require('./models/Equipe');
const Circuito = require('./models/Circuito');

//middlewares
const authMiddleware = require('./config/authMiddleware');

//routes
const authRoutes = require('./routes/authRoutes');
const pilotoRoutes = require('./routes/pilotoRoutes');
const equipeRoutes = require('./routes/equipeRoutes');
const circuitoRoutes = require('./routes/circuitoRoutes');


const app = express();

app.use(compression()); 

app.use(express.static(path.join(__dirname, '../frontend/build')));
app.use(cors());
app.use(express.json());

const logDirectory = path.join(__dirname, 'logs');
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

const accessLogStream = fs.createWriteStream(path.join(logDirectory, 'access.log'), { flags: 'a' });
app.use(morgan('combined', { stream: accessLogStream }));
app.use(morgan('dev'));

const sslOptions = {
  key: fs.readFileSync(path.join(__dirname, 'config' ,'ssl', 'server.key')),
  cert: fs.readFileSync(path.join(__dirname, 'config', 'ssl', 'server.cert'))
}

//rotas
app.use('/auth', authRoutes);
app.use('/pilotos', pilotoRoutes);
app.use('/equipes', equipeRoutes);
app.use('/circuitos', circuitoRoutes);

app.get('/rota-protegida', authMiddleware, (req, res) => {
  res.json({ message: `Você está autenticado! ID: ${req.userId}` });
})

const porta = 3001;

sequelize.sync().then(() => {
    console.log('Banco sincronizado.');
    https.createServer(sslOptions, app).listen(porta, () => {
    console.log(`Servidor HTTPS rodando na porta ${porta}`);
  });
})
