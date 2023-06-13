const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { CustomError } = require('../utils/customError');

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
    select: true,
  },
});

userSchema.statics.findUserByCredentials = async function (email, password) {
  try {
    const user = await this.findOne({ email });
    if (!user) {
      CustomError('ValidationError', 'Неправильные почта или пароль');
    }
    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      CustomError('ValidationError', 'Неправильные почта или пароль');
    }
    return user;
  } catch (err) {
    CustomError(err.name, err.message);
  }
};

module.exports = mongoose.model('user', userSchema);
