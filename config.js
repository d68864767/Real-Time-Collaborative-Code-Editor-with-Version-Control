```javascript
// Import required modules
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const User = mongoose.model('User');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Passport JWT strategy options
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.AUTH_SECRET;

module.exports = function(passport) {
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      User.findById(jwt_payload.id)
        .then(user => {
          if (user) {
            return done(null, user);
          }
          return done(null, false);
        })
        .catch(err => console.log(err));
    })
  );
};

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  name: process.env.DB_NAME
};

// Server configuration
const serverConfig = {
  port: process.env.SERVER_PORT
};

// WebSocket configuration
const wsConfig = {
  port: process.env.WS_PORT
};

module.exports = {
  dbConfig,
  serverConfig,
  wsConfig
};
```
