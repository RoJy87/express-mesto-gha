const {
  VALID_ERR,
  DATA_ERR,
  DEFAULT_ERR,
} = require('../constants/constants');

class CustomError extends Error {
  constructor(name, message) {
    super(message);
    this.name = name;
  }
}

module.exports.CustomError = (name, message = '') => { throw new CustomError(name, message); };

module.exports.validationError = ({ message, res }) => {
  res.status(VALID_ERR).send({
    message,
  });
};

module.exports.dataError = ({ message, res }) => {
  res.status(DATA_ERR).send({
    message,
  });
};

module.exports.defaultError = ({ res }) => {
  res.status(DEFAULT_ERR).send({
    message: 'Мы не знаем, что это за ошибка, если б мы знали, что это за ошибка, но мы не знаем, что это за ошибка',
  });
};
