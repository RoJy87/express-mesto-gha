const {
  VALID_ERR,
  DATA_ERR,
  DEFAULT_ERR,
} = require('../constants/constants');

module.exports.validationError = ({ err, message, res }) => {
  res.status(VALID_ERR).send({
    message,
    err: err.message,
    stack: err.stack,
  });
};

module.exports.dataError = ({ err, message, res }) => {
  res.status(DATA_ERR).send({
    message,
    err: err.message,
    stack: err.stack,
  });
};

module.exports.defaultError = ({ err, res }) => {
  res.status(DEFAULT_ERR).send({
    message: 'Мы не знаем, что это за ошибка, если б мы знали, что это за ошибка, но мы не знаем, что это за ошибка',
    err: err.message,
    stack: err.stack,
  });
};
