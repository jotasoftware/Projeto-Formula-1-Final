require('dotenv').config();

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  throw new Error('Erro ao encontrar o segredo');
}

module.exports = { jwtSecret };