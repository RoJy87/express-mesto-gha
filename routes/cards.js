const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

router.get('/', getCards);

router.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required().min(2).uri(),
      owner: Joi.string().alphanum().length(24),
    }),
  }),
  createCard
);

router.delete(
  '/:cardId',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().alphanum().length(24),
    }),
    headers: Joi.object().keys({}).unknown(true),
    query: Joi.object().keys({}).unknown(true),
  }),
  deleteCard
);

router.put(
  '/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().alphanum().length(24),
    }),
    headers: Joi.object().keys({}).unknown(true),
    query: Joi.object().keys({}).unknown(true),
  }),
  likeCard
);

router.delete(
  '/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().alphanum().length(24),
    }),
    headers: Joi.object().keys({}).unknown(true),
    query: Joi.object().keys({}).unknown(true),
  }),
  dislikeCard
);

module.exports = router;
