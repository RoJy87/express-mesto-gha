const Card = require('../models/card');
const {
  validationError, dataError, defaultError, CustomError,
} = require('../utils/customError');

const {
  CREATED_CODE,
} = require('../constants/constants');

module.exports.getCards = async (req, res) => {
  try {
    const cards = await Card.find({}).populate(['owner', 'likes']);
    res.send({ data: cards });
  } catch (err) { defaultError({ res }); }
};

module.exports.createCard = async (req, res) => {
  try {
    const { _id } = req.user;
    const { name, link } = req.body;
    const card = await Card.create({
      name,
      link,
      owner: _id,
    });
    res.status(CREATED_CODE).send({ data: card });
  } catch (err) {
    if (err.name === 'ValidationError') {
      validationError({
        message: 'Переданы некорректные данные при создании карточки',
        res,
      });
    } else { defaultError({ err, res }); }
  }
};

module.exports.deleteCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndRemove(req.params.cardId);
    if (!card) CustomError('CastError');
    res.send({ data: card });
  } catch (err) {
    if (err.message.includes('failed for value')) {
      validationError({
        message: 'Переданы некорректные данные карточки, введите корректные данные',
        res,
      });
    } else if (err.name === 'CastError') {
      dataError({ message: 'Карточка не найдена, введите корректные данные', res });
    } else { defaultError({ res }); }
  }
};

module.exports.likeCard = async (req, res) => {
  try {
    let card = await Card.findById(req.params.cardId);
    if (!card) CustomError('CastError');
    if (card.likes.includes(req.user._id)) CustomError('ValidationError');
    card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    res.send({ data: card });
  } catch (err) {
    if (err.message.includes('failed for value')) {
      validationError({
        message: 'Переданы некорректные данные для постановки/снятии лайка',
        res,
      });
    } else if (err.name === 'CastError') {
      dataError({ message: 'Передан несуществующий _id карточки', res });
    } else { defaultError({ res }); }
  }
};

module.exports.dislikeCard = async (req, res) => {
  try {
    let card = await Card.findById(req.params.cardId);
    if (!card) CustomError('CastError');
    if (!card.likes.includes(req.user._id)) CustomError('ValidationError');
    card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    res.send({ data: card });
  } catch (err) {
    if (err.message.includes('failed for value')) {
      validationError({
        err,
        message: 'Переданы некорректные данные для постановки/снятии лайка',
        res,
      });
    } else if (err.name === 'CastError') {
      dataError({ message: 'Передан несуществующий _id карточки', res });
    } else { defaultError({ res }); }
  }
};
