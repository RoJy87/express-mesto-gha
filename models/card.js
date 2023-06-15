const mongoose = require('mongoose');
const NotFoundError = require('../middlewares/errors/NotFoundError');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'user',
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

cardSchema.statics.findCardById = async function findCard(cardId, next) {
  let card;
  try {
    card = await this.findById(cardId);
    if (!card) { throw new NotFoundError('Карточка не найдена'); }
  } catch (err) { next(err); }
  return card;
};

module.exports = mongoose.model('card', cardSchema);
