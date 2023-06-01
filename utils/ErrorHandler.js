class ErrorHandler extends Error {
  constructor(message) {
    super(message);
    this.incorrectDataName = 'ValidationError';
    this.notFoundDataName = 'CastError';
    this.incorrectDataCode = 400;
    this.notFoundDataCode = 404;
    this.defaultErrorCode = 500;
  }

  getError(err, res) {
    if (err.name === this.incorrectDataName) {
      return res
        .status(this.incorrectDataCode)
        .send({ message: 'переданы некорректные данные' });
    }
    if (err.name === this.notFoundDataName) {
      return res
        .status(this.notFoundDataCode)
        .send({ message: 'Запрашиваемый пользователь не найден' });
    }
    return res.status(this.defaultErrorCode).send({
      message:
        'Мы не знаем, что это за ошибка, если бы мы знали, что это за ошибка, но мы не знаем что это за ошибка',
    });
  }
}

module.exports = new ErrorHandler();
