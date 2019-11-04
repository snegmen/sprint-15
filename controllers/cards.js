const Card = require('../models/card');
const Error500 = require('../errors/500-err');

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => next(new Error500(`Ошибка при создании карточки -- ${err.message}`)));
};

module.exports.getAllCards = (req, res, next) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.send({ data: cards }))
    .catch(() => next(new Error500('Ошибка при чтении всех карточек')));
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.id)
    // eslint-disable-next-line consistent-return
    .then((card) => {
      if (!card) return Promise.reject(new Error('Такой карты нет'));
      if (JSON.stringify(card.owner) !== JSON.stringify(req.user._id)) return Promise.reject(new Error('Карта не ваша! Удалить нельзя!'));
      Card.remove(card)
        .then((cardToDelete) => res.send(cardToDelete !== null ? { data: card } : { data: 'Нечего удалять' }))
        .catch(() => { throw new Error500('Ошибка при удалении карты') });
    })
    .catch((err) => next(err.statusCode ? err : new Error404('Такой карты нет')));
};
