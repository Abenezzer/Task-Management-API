module.exports = function (err, req, res, next) {
  res.status(err.statusCode).send(err.message);
//   console.log(err);
};
