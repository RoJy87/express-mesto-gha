/* eslint-disable no-underscore-dangle */
const Card = require('../models/card');
const errorValidity = require('../utils/ErrorHandler');

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send({ data: cards }))
    .catch((err) => errorValidity.getError(err, res));
};

module.exports.createCard = (req, res) => {
  const { _id } = req.user;
  const { name, link, likes, createdAt } = req.body;

  Card.create({
    name,
    link,
    owner: _id,
    likes,
    createdAt,
  })
    .then((card) => res.send({ data: card }))
    .catch((err) => errorValidity.getError(err, res));
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail((err) => err)
    .then((card) => res.send({ data: card }))
    .catch((err) => errorValidity.getError(err, res));
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => res.send({ data: card }))
    .catch((err) => errorValidity.getError(err, res));
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => res.send({ data: card }))
    .catch((err) => errorValidity.getError(err, res));
};
