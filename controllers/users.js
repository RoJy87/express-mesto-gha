/* eslint-disable no-underscore-dangle */
const User = require('../models/user');
const { validationError, dataError, defaultError } = require('../utils/customError');

const {
  OK_CODE,
  CREATED_CODE,
} = require('../constants/constants');

module.exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(OK_CODE).send({ data: users });
  } catch (err) { defaultError({ err, res }); }
};

module.exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) throw new Error('ObjectId failed');
    res.status(OK_CODE).send({ data: user });
  } catch (err) {
    if (err.message.includes('failed for value')) {
      validationError({
        err,
        message: 'Переданы некорректные данные, введите корректные данные',
        res,
      });
    } else if (err.message.includes('ObjectId failed')) {
      dataError({ err, message: 'Пользователь не найден, введите корректные данные', res });
    } else { defaultError({ err, res }); }
  }
};

module.exports.createUser = async (req, res) => {
  try {
    const { name, about, avatar } = req.body;
    const user = await User.create({ name, about, avatar });
    res.status(CREATED_CODE).send({ data: user });
  } catch (err) {
    if (err.message.includes('validation failed')) {
      validationError({
        err,
        message: 'Переданы некорректные данные, введите корректные данные',
        res,
      });
    } else { defaultError({ err, res }); }
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
    res.status(OK_CODE).send({ data: user });
  } catch (err) {
    if (err.message.toLowerCase().includes('validation failed')) {
      validationError({
        err,
        message: 'Переданы некорректные данные при обновлении профиля',
        res,
      });
    } else if (err.message.includes('ObjectId failed')) {
      dataError({ err, message: 'Пользователь не найден, введите корректные данные', res });
    } else { defaultError({ err, res }); }
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
    res.status(OK_CODE).send({ data: user });
  } catch (err) {
    if (err.message.toLowerCase().includes('validation failed')) {
      validationError({
        err,
        message: 'Переданы некорректные данные при обновлении аватара',
        res,
      });
    } else if (err.message.includes('ObjectId failed')) {
      dataError({ err, message: 'Пользователь не найден, введите корректные данные', res });
    } else { defaultError({ err, res }); }
  }
};
