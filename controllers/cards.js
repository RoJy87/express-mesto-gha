const Card = require('../models/card');
const AuthError = require('../middlewares/errors/AuthError');
const NotFoundError = require('../middlewares/errors/NotFoundError');

const { CREATED_CODE } = require('../constants/constants');
const ForbiddenError = require('../middlewares/errors/ForbiddenError');

module.exports.getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({}).populate(['owner', 'likes']);
    res.send(cards);
  } catch (err) { next(err); }
};

module.exports.createCard = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { name, link } = req.body;
    const card = await Card.create({
      name,
      link,
      owner: _id,
    });
    res.status(CREATED_CODE).send(card);
  } catch (err) { next(err); }
};

module.exports.deleteCard = async (req, res, next) => {
  try {
    const { _id } = req.user;
    let card = await Card.findById(req.params.cardId);
    if (!card) {
      throw new NotFoundError('Переданы некорректные данные');
    }
    if (card.owner.toString() !== _id) {
      throw new ForbiddenError('Нет доступа к карточке');
    }
    card = await Card.findByIdAndRemove(req.params.cardId);
    res.send(card);
  } catch (err) { next(err); }
};

module.exports.likeCard = async (req, res, next) => {
  try {
    let card = await Card.findById(req.params.cardId);
    if (!card) throw new NotFoundError('Карточка не найдена');
    if (card.likes.includes(req.user._id)) throw new AuthError('Переданы некорректные данные');
    card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    res.send(card);
  } catch (err) { next(err); }
};

module.exports.dislikeCard = async (req, res, next) => {
  try {
    let card = await Card.findById(req.params.cardId);
    if (!card) throw new NotFoundError('Карточка не найдена');
    if (!card.likes.includes(req.user._id)) throw new AuthError('Переданы некорректные данные');
    card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    res.send(card);
  } catch (err) { next(err); }
};
