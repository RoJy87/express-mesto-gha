const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const AuthError = require('../middlewares/errors/AuthError');
const NotFoundError = require('../middlewares/errors/NotFoundError');

const { CREATED_CODE } = require('../constants/constants');
const CreateUserError = require('../middlewares/errors/CreateUserError');

const hidePassword = (user) => {
  const userData = Object.keys(user._doc)
    .filter((key) => key !== 'password')
    .reduce((acc, key) => { acc[key] = user._doc[key]; return acc; }, {});
  return userData;
};

module.exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) { next(err); }
};

module.exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) throw new NotFoundError('Пользователь не найден, введите корректные данные');
    res.send(user);
  } catch (err) { next(err); }
};

module.exports.getCurrentUser = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const user = await User.findOne({ _id });
    if (!user) throw new NotFoundError('Пользователь не найден, введите корректные данные');
    res.send(user);
  } catch (err) { next(err); }
};

module.exports.createUser = async (req, res, next) => {
  try {
    const {
      name, about, avatar, email,
    } = req.body;
    const hash = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    });
    return res.status(CREATED_CODE).send(hidePassword(user));
  } catch (err) {
    if (err.code === 11000) {
      return next(new CreateUserError('Такой пользователь уже существует'));
    }
    return next(err);
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findUserByCredentials(email, password, next);
    const token = jwt.sign(
      { _id: user._id },
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
      {
        expiresIn: '7d',
      },
    );
    res.cookie('token', token, {
      maxAge: 3600000 * 24 * 7,
      httpOnly: true,
      sameSite: true,
    }).send(hidePassword(user));
  } catch (err) { next(err); }
};

module.exports.updateUser = async (req, res, next) => {
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
    if (!user) throw new AuthError('Пользователь не найден, введите корректные данные');
    res.send(user);
  } catch (err) { next(err); }
};

module.exports.updateUserAvatar = async (req, res, next) => {
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
    if (!user) throw new AuthError('Пользователь не найден, введите корректные данные');
    res.send(user);
  } catch (err) { next(err); }
};
