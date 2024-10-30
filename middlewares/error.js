const logger = require("../utils/logger");
module.exports = function (err, req, res, next) {
  res.status(err.statusCode).send(err.message);
  if (err.statusCode >= 500) logger.error(err.message, err);
  //   console.log(err);
};
