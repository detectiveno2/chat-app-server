const { OK_STATUS } = require('../constants/httpStatus.constant');

module.exports.index = async (req, res) => {
  const data = req.user;

  res.status(OK_STATUS).json(data);
};
