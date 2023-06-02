/* eslint-disable no-underscore-dangle */
const Card = require('../models/card');

module.exports.getCards = async (req, res) => {
  try {
    const cards = await Card.find({}).populate(['owner', 'likes']);
    res.status(200).send({ data: cards });
  } catch (err) {
    res.status(500).send({
      message:
        'Мы не знаем, что это за ошибка, если б мы знали, что это за ошибка, но мы не знаем, что это за ошибка',
      err: err.message,
      stack: err.stack,
    });
  }
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
    res.status(201).send({ data: card });
  } catch (err) {
    if (err.message.includes('validation failed')) {
      res.status(400).send({
        message: 'Переданы некорректные данные при создании карточки',
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

module.exports.deleteCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndRemove(req.params.cardId);
    if (!card) throw new Error('ObjectId failed');
    res.status(200).send({ data: card });
  } catch (err) {
    if (err.message.includes('ObjectId failed')) {
      res.status(404).send({
        message: 'Карточка не найдена, введите корректные данные',
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

module.exports.likeCard = async (req, res) => {
  try {
    let card = await Card.findById(req.params.cardId);
    if (!card) throw new Error('validation failed');
    if (card.likes.includes(req.user._id)) throw new Error('validation failed');
    card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    res.status(200).send({ data: card });
  } catch (err) {
    if (err.message.includes('validation failed')) {
      res.status(400).send({
        message: 'Переданы некорректные данные для постановки/снятии лайка',
        err: err.message,
        stack: err.stack,
      });
    } else if (err.message.includes('ObjectId failed')) {
      res.status(404).send({
        message: 'Передан несуществующий _id карточки',
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

module.exports.dislikeCard = async (req, res) => {
  try {
    let card = await Card.findById(req.params.cardId);
    if (!card) throw new Error('validation failed');
    if (!card.likes.includes(req.user._id)) {
      throw new Error('validation failed');
    }
    card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    res.status(200).send({ data: card });
  } catch (err) {
    if (err.message.includes('validation failed')) {
      res.status(400).send({
        message: 'Переданы некорректные данные для постановки/снятии лайка',
        err: err.message,
        stack: err.stack,
      });
    } else if (err.message.includes('ObjectId failed')) {
      res.status(404).send({
        message: 'Передан несуществующий _id карточки',
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
