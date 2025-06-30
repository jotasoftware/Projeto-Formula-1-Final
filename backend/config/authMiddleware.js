const jwt = require('jsonwebtoken');
const {jwtSecret} = require('./env.js');
const redisClient = require('./redis.js');

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader) return res.status(401).json({ message: 'Token não fornecido' })

  const token = authHeader.split(' ')[1]

  try{
    const isBlacklisted = await redisClient.get(`blacklist:${token}`);
    if (isBlacklisted) {
      return res.status(403).json({ message: 'Token inválido (logout)' });
    }
    const decoded = jwt.verify(token, jwtSecret);
    req.userId = decoded.id;
    next();
  }catch{
    return res.status(403).json({ message: 'Token inválido' });
  }
}
