const Card = require('../models/card');
const ValidationError = require('../middlewares/errors/ValidationError');
const ForbiddenError = require('../middlewares/errors/ForbiddenError');

const { CREATED_CODE } = require('../constants/constants');

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
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new ValidationError('Некорректные данные при создании карточки'));
    } else { next(err); }
  }
};

module.exports.deleteCard = async (req, res, next) => {
  try {
    const { _id } = req.user;
    let card = await Card.findCardById(req.params.cardId, next);
    if (card.owner.toString() !== _id) {
      throw new ForbiddenError('Нет доступа к карточке');
    }
    card = await Card.findByIdAndRemove(req.params.cardId);
    res.send(card);
  } catch (err) { next(err); }
};

module.exports.likeCard = async (req, res, next) => {
  try {
    let card = await Card.findCardById(req.params.cardId, next);
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
    let card = await Card.findCardById(req.params.cardId, next);
    card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    res.send(card);
  } catch (err) { next(err); }
};
