const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');

const config = require('./config/init');
const { pasportConfigure } = require('./config/passport');

mongoose.Promise = global.Promise;
mongoose.connect(config.database);

mongoose.connection.on('connected', () => {
  console.log(`Connected to database: ${config.database}`);
});

mongoose.connection.on('error', err => {
  console.log(`Database error: ${err}`);
});

const app = express();
const usersRoute = require('./routes/users');

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());
pasportConfigure(passport);

app.use('/users', usersRoute);
app.get('/', (req, res) => {
  res.sendFile('index.html');
});

app.listen(config.port, () => {
  console.log(`Server started on port: ${config.port}`);
});
