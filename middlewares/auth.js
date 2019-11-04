const jwt = require('jsonwebtoken');
const AuthError = require('../errors/auth-err');

const { NODE_ENV, JWT_SECRET } = process.env;
// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (e) {
    // return res
    //   .status(401)
    //   .send({ message: 'Необходима авторизация' });
    const err = new AuthError('Ошибка авторизации');
    next(err);
  }
  req.user = payload;

  next();
};
