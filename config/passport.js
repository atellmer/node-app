const jwtStrategy = require('passport-jwt').Strategy;
const extractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user');
const config = require('../config/init');


function pasportConfigure(passport) {
  const options = {
    jwtFromRequest: extractJwt.fromAuthHeader(),
    secretOrKey: config.secret
  };

  passport.use(jwtInit(options));

  function jwtInit(options) {
    return new jwtStrategy(options, (jwtPayload, done) => {
      User.getUserById(jwtPayload._doc._id)
        .then(user => {
          if (user) {
            return done(null, user);
          } else {
            return done(null, false);
          }
        })
        .catch(err => {
          return done(err. false);
        })
      });
  }
}

module.exports = {
  pasportConfigure
}
