const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

/* async function main() {
  await mongoose.connect('mongodb://localhost:27017/mestodb');
}

main().catch((err) => console.log(err)); */

app.use((req, res, next) => {
  req.user = {
    _id: '6478ed500ecb51a508d78131', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

/* app.use(express.static(path.join(__dirname, 'public'))); */
app.listen(PORT, () => {
  console.log(`Серврер запущен на порту ${PORT}`);
});
