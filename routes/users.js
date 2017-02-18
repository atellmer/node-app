const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const config = require('../config/init');

const ROUTES = {
  register: '/register',
  auth: '/auth',
  profile: '/profile'
}

router.post(ROUTES.register, (req, res, next) => {
  const newUser = new User.model({
    name: req.body.name,
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  });

  User.addUser(newUser)
    .then(user => {
      res.json({ success: true, msg: 'User registered' });
    })
    .catch(err => {
      res.json({ success: false, msg: 'Failed register user' });
    });
});

router.post(ROUTES.auth, (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  User.getUserByUsername(username)
    .then(user => {
      if (!user) {
        return res.json({ success: false, msg: 'Wrong username or password' });
      }
      return user;
    })
    .then(user => {
      User.comparePassword(password, user.password)
        .then(isMatch => {
          if (isMatch) {
            const token = jwt.sign(user, config.secret, {
              expiresIn: 604800
            });

            res.json({
              success: true,
              token: `JWT ${token}`,
              user: {
                id: user._id,
                name: user.name,
                username: user.username,
                email: user.email
              }
            });
          } else {
            return res.json({ success: false, msg: 'Wrong username or password' });
          }
        });
    })
    .catch(err => {
      throw err;
    });
});

router.get(ROUTES.profile, passport.authenticate('jwt', { session: false }), (req, res, next) => {
  res.json({ user: req.user });
});

module.exports = router;
