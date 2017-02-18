const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/init');

const UserSchema = mongoose.Schema({
  name: {
    type: String
  },
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

const model = mongoose.model('User', UserSchema);

function getUserById(id) {
  return new Promise((resolve, reject) => {
    model.findById(id, (err, user) => {
      if (err) reject(err);
      resolve(user);
    });
  });
}

function getUserByUsername(username) {
  return new Promise((resolve, reject) => {
    model.findOne({ username }, (err, user) => {
      if (err) reject(err);
      resolve(user);
    });
  });
}

function addUser(newUser) {
  return new Promise((resolve, reject) => {
    _genSalt()
    .then(salt => _hash(newUser.password, salt))
    .then(hash => _saveUser(newUser, hash))
    .then(user => {
      resolve(user);
    })
    .catch(err => {
      reject(err);
    });
  });
 
  function _genSalt() {
    return new Promise((resolve, reject) => {
      bcrypt.genSalt(10, (err, salt) => {
        if (err) reject(err);
        resolve(salt);
      });
    });
  }

  function _hash(password, salt) {
    return new Promise((resolve, reject) => {
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) reject(err);
        resolve(hash);
      });
    });
  }

  function _saveUser(newUser, hash) {
    return new Promise((resolve, reject) => {
      newUser.password = hash;
      newUser.save((err, user) => {
        if (err) reject(err);
        resolve(user);
      });
    }); 
  }
}

function comparePassword(candidatePassword, hash) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
        if (err) reject(err);
        resolve(isMatch);
      });
    });
}

module.exports = {
  model,
  getUserById,
  getUserByUsername,
  addUser,
  comparePassword
};
