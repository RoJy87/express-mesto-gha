/* eslint-disable no-underscore-dangle */
const User = require('../models/user');

module.exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send({ data: users });
  } catch (err) {
    res.status(500).send({
      message:
        'Мы не знаем, что это за ошибка, если б мы знали, что это за ошибка, но мы не знаем, что это за ошибка',
      err: err.message,
      stack: err.stack,
    });
  }
};

module.exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) throw new Error('ObjectId failed');
    res.status(200).send({ data: user });
  } catch (err) {
    if (err.message.includes('ObjectId failed')) {
      res.status(400).send({
        message: 'Пользователь не найден, введите корректные данные',
        err: err.message,
        stack: err.stack,
      });
    } else {
      res.status(500).send({
        message:
          'Мы не знаем, что это за ошибка, если б мы знали, что это за ошибка, но мы не знаем, что это за ошибка',
        err: err.message,
        stack: err.stack,
      });
    }
  }
};

module.exports.createUser = async (req, res) => {
  try {
    const { name, about, avatar } = req.body;
    const user = await User.create({ name, about, avatar });
    res.status(201).send({ data: user });
  } catch (err) {
    if (err.message.includes('validation failed')) {
      res.status(400).send({
        message: 'Переданы некорректные данные при создании пользователя',
        err: err.message,
        stack: err.stack,
      });
    } else {
      res.status(500).send({
        message:
          'Мы не знаем, что это за ошибка, если б мы знали, что это за ошибка, но мы не знаем, что это за ошибка',
        err: err.message,
        stack: err.stack,
      });
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
      },
    );
    res.status(200).send({ data: user });
  } catch (err) {
    if (err.message.toLowerCase().includes('validation failed')) {
      res.status(400).send({
        message: 'Переданы некорректные данные при обновлении профиля',
        err: err.message,
        stack: err.stack,
      });
    } else if (err.message.includes('ObjectId failed')) {
      res.status(404).send({
        message: 'Пользователь не найден, введите корректные данные',
        err: err.message,
        stack: err.stack,
      });
    } else {
      res.status(500).send({
        message:
          'Мы не знаем, что это за ошибка, если б мы знали, что это за ошибка, но мы не знаем, что это за ошибка',
        err: err.message,
        stack: err.stack,
      });
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
      },
    );
    res.status(200).send({ data: user });
  } catch (err) {
    if (err.message.toLowerCase().includes('validation failed')) {
      res.status(400).send({
        message: 'Переданы некорректные данные при обновлении аватара',
        err: err.message,
        stack: err.stack,
      });
    } else if (err.message.includes('ObjectId failed')) {
      res.status(404).send({
        message: 'Пользователь не найден, введите корректные данные',
        err: err.message,
        stack: err.stack,
      });
    } else {
      res.status(500).send({
        message:
          'Мы не знаем, что это за ошибка, если б мы знали, что это за ошибка, но мы не знаем, что это за ошибка',
        err: err.message,
        stack: err.stack,
      });
    }
  }
};
