const jwt = require('jsonwebtoken');

const JWT_KEY = 'Secret';

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, JWT_KEY);
    req.userData = decoded;
    next();
    return true
  } catch (error) {
    return res.status(401).json({
      message: 'Auth Failed',
    });
  }
};
