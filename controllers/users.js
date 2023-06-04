const User = require('../models/user');
const {
  validationError, dataError, defaultError, CustomError,
} = require('../utils/customError');

const {
  CREATED_CODE,
} = require('../constants/constants');

module.exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.send({ data: users });
  } catch (err) { defaultError({ res }); }
};

module.exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) CustomError('CastError');
    res.send({ data: user });
  } catch (err) {
    if (err.message.includes('failed for value')) {
      validationError({
        message: 'Переданы некорректные данные, введите корректные данные',
        res,
      });
    } else if (err.name === 'CastError') {
      dataError({ message: 'Пользователь не найден, введите корректные данные', res });
    } else { defaultError({ res }); }
  }
};

module.exports.createUser = async (req, res) => {
  try {
    const { name, about, avatar } = req.body;
    const user = await User.create({ name, about, avatar });
    res.status(CREATED_CODE).send({ data: user });
  } catch (err) {
    if (err.name === 'ValidationError') {
      validationError({
        message: 'Переданы некорректные данные, введите корректные данные',
        res,
      });
    } else { defaultError({ res }); }
  }
};

module.exports.updateUser = async (req, res) => {
  try {
    const { name, about } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      {
        new: true,
        runValidators: true,
      },
    );
    if (!user) CustomError('CastError');
    res.send({ data: user });
  } catch (err) {
    if (err.name === 'ValidationError') {
      validationError({
        message: 'Переданы некорректные данные при обновлении профиля',
        res,
      });
    } else if (err.name === 'CastError') {
      dataError({ message: 'Пользователь не найден, введите корректные данные', res });
    } else { defaultError({ res }); }
  }
};

module.exports.updateUserAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      {
        new: true,
        runValidators: true,
      },
    );
    if (!user) CustomError('CastError');
    res.send({ data: user });
  } catch (err) {
    if (err.name === 'ValidationError') {
      validationError({
        message: 'Переданы некорректные данные при обновлении аватара',
        res,
      });
    } else if (err.name === 'CastError') {
      dataError({ message: 'Пользователь не найден, введите корректные данные', res });
    } else { defaultError({ res }); }
  }
};
