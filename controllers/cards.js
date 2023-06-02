/* eslint-disable no-underscore-dangle */
const Card = require('../models/card');
const { validationError, dataError, defaultError } = require('../utils/customError');

const {
  OK_CODE,
  CREATED_CODE,
  ID_LENGTH,
} = require('../constants/constants');

module.exports.getCards = async (req, res) => {
  try {
    const cards = await Card.find({}).populate(['owner', 'likes']);
    res.status(OK_CODE).send({ data: cards });
  } catch (err) { defaultError({ err, res }); }
};

module.exports.createCard = async (req, res) => {
  try {
    const { _id } = req.user;
    const {
      name, link, likes, createdAt,
    } = req.body;
    const card = await Card.create({
      name,
      link,
      owner: _id,
      likes,
      createdAt,
    });
    res.status(CREATED_CODE).send({ data: card });
  } catch (err) {
    if (err.message.includes('validation failed')) {
      validationError({
        err,
        message: 'Переданы некорректные данные при создании карточки',
        res,
      });
    } else { defaultError({ err, res }); }
  }
};

module.exports.deleteCard = async (req, res) => {
  try {
    if (req.params.cardId.length !== ID_LENGTH) throw new Error('validation failed');
    const card = await Card.findByIdAndRemove(req.params.cardId);
    if (!card) throw new Error('ObjectId failed');
    res.status(OK_CODE).send({ data: card });
  } catch (err) {
    if (err.message.includes('validation failed')) {
      validationError({
        err,
        message: 'Переданы некорректные данные карточки, введите корректные данные',
        res,
      });
    } else if (err.message.includes('ObjectId failed')) {
      dataError({ err, message: 'Карточка не найдена, введите корректные данные', res });
    } else { defaultError({ err, res }); }
  }
};

module.exports.likeCard = async (req, res) => {
  try {
    if (req.params.cardId.length !== ID_LENGTH) throw new Error('failed for value');
    let card = await Card.findById(req.params.cardId);
    if (!card) throw new Error('ObjectId failed');
    if (card.likes.includes(req.user._id)) throw new Error('failed for value');
    card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    res.status(OK_CODE).send({ data: card });
  } catch (err) {
    if (err.message.includes('failed for value')) {
      validationError({
        err,
        message: 'Переданы некорректные данные для постановки/снятии лайка',
        res,
      });
    } else if (err.message.includes('ObjectId failed')) {
      dataError({ err, message: 'Передан несуществующий _id карточки', res });
    } else { defaultError({ err, res }); }
  }
};

module.exports.dislikeCard = async (req, res) => {
  try {
    if (req.params.cardId.length !== ID_LENGTH) throw new Error('failed for value');
    let card = await Card.findById(req.params.cardId);
    if (!card) throw new Error('ObjectId failed');
    if (!card.likes.includes(req.user._id)) {
      throw new Error('failed for value');
    }
    card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    res.status(OK_CODE).send({ data: card });
  } catch (err) {
    if (err.message.includes('failed for value')) {
      validationError({
        err,
        message: 'Переданы некорректные данные для постановки/снятии лайка',
        res,
      });
    } else if (err.message.includes('ObjectId failed')) {
      dataError({ err, message: 'Передан несуществующий _id карточки', res });
    } else { defaultError({ err, res }); }
  }
};
