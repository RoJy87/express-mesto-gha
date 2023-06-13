const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const AuthError = require('../middlewares/errors/AuthError');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    required: false,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    required: false,
    default:
      'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = async function findUser(email, password, next) {
  let user;
  try {
    user = await this.findOne({ email }).select('+password');
    if (!user) {
      throw new AuthError('Неправильные почта или пароль');
    }
    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      throw new AuthError('Неправильные почта или пароль');
    }
  } catch (err) { next(err); }
  return user;
};

module.exports = mongoose.model('user', userSchema);
