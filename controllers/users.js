const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  validationError,
  dataError,
  defaultError,
  CustomError,
} = require('../utils/customError');

const { CREATED_CODE } = require('../constants/constants');

module.exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.send({ data: users });
  } catch (err) {
    defaultError({ res });
  }
};

module.exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) CustomError('NotFound');
    res.send({ data: user });
  } catch (err) {
    if (err.name === 'CastError') {
      validationError({
        message: 'Переданы некорректные данные, введите корректные данные',
        res,
      });
    } else if (err.name === 'NotFound') {
      dataError({
        message: 'Пользователь не найден, введите корректные данные',
        res,
      });
    } else {
      defaultError({ res });
    }
  }
};

module.exports.getCurrentUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) CustomError('NotFound');
    res.send({ data: user });
  } catch (err) {
    if (err.name === 'CastError') {
      validationError({
        message: 'Переданы некорректные данные, введите корректные данные',
        res,
      });
    } else if (err.name === 'NotFound') {
      dataError({
        message: 'Пользователь не найден, введите корректные данные',
        res,
      });
    } else {
      defaultError({ res });
    }
  }
};

module.exports.createUser = async (req, res) => {
  try {
    const hash = await bcrypt.hash(req.body.password, 10);
    const { name, about, avatar, email } = req.body;
    if (!validator.isEmail(email)) {
      CustomError('ValidationError');
    }
    const user = await User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    });
    res.status(CREATED_CODE).send({ email: user.email, _id: user._id });
  } catch (err) {
    if (err.name === 'ValidationError') {
      validationError({
        message: 'Переданы некорректные данные, введите корректные данные',
        res,
      });
    } else {
      defaultError({ res });
    }
  }
};

module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findUserByCredentials(email, password);
    const token = jwt.sign({ _id: user._id }, 'some-secret-key', {
      expiresIn: '7d',
    });
    res.send({ user, message: 'Всё верно!', token });
  } catch (err) {
    if (err.name === 'ValidationError') {
      validationError({
        message: err.message,
        res,
      });
    } else if (err.name === 'CastError') {
      dataError({
        message: err.message,
        res,
      });
    } else {
      defaultError({ res });
    }
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
      }
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
      dataError({
        message: 'Пользователь не найден, введите корректные данные',
        res,
      });
    } else {
      defaultError({ res });
    }
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
      }
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
      dataError({
        message: 'Пользователь не найден, введите корректные данные',
        res,
      });
    } else {
      defaultError({ res });
    }
  }
};
