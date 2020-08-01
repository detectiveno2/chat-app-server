const jwt = require('jsonwebtoken');

module.exports.checkAuth = (req, res, next) => {
  const UNAUTHORIZATION_STATUS = 401;
  const FORBIDDEN_STATUS = 403;

  // Check unauth case.
  const token = req.headers['authorization'];
  if (token === 'null') {
    return res.status(UNAUTHORIZATION_STATUS).send('Unauth.');
  }

  // Check forbidden case.
  const jwtToken = token.split(' ')[1];
  try {
    const user = jwt.verify(jwtToken, process.env.JWT_SECRET_KEY);
    req.user = user;
  } catch (error) {
    return res.status(FORBIDDEN_STATUS).send('Wrong token.');
  }

  next();
};
