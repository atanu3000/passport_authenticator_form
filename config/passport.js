const passport = require('passport');
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const bcrypt = require("bcrypt");

// Load User model
const UserData = require("../models/userData");
const GoogleUser = require("../models/googleUser");
const { Strategy } = require('passport-local');

module.exports = () => {  // perform local strategy
  passport.use(new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
    // Match Email
    UserData.findOne({ email: email, })
      .then((user) => {
        if (!user) {
          return done(null, false, { message: "This Email Address is not registered yet!", });
        }

        // Match Password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: "Incorrect Password!" });
          }
        });
      });
  }));

  const YOUR_GOOGLE_CLIENT_ID = "344009278028-p79kkogf24avg9jfm45dkkn15krej8np.apps.googleusercontent.com";
  const YOUR_GOOGLE_CLIENT_SECRET = "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";
  let YOUR_callbackURL = "";

  if (process.env.NODE_ENV === 'development') {
    YOUR_callbackURL = "http://localhost:5000/auth/google/callback";
  } else if (process.env.NODE_ENV === 'production') {
    YOUR_callbackURL = "https://passport-authenticator-form.onrender.com/auth/google/callback";
  }
  passport.use(new GoogleStrategy({ // perform google strategy
    clientID: YOUR_GOOGLE_CLIENT_ID,
    clientSecret: YOUR_GOOGLE_CLIENT_SECRET,
    callbackURL: YOUR_callbackURL,
    // passReqToCallback: true,
  },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if the user is already registered based on their Google profile ID
        const existingGoogleUser = await GoogleUser.findOne({ googleId: profile.id });
        if (existingGoogleUser) {
          // User is already registered, proceed with login
          return done(null, existingGoogleUser);
        }

        // User is not registered, create a new user
        const newUser = new GoogleUser({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
        });

        await newUser.save();
        return done(null, newUser); // Pass the new user to the next steps in the authentication flow
      } catch (err) {
        return done(err, false); // Something went wrong, pass false as the user
      }
    }
  )
  );

  passport.serializeUser((user, done) => {
    if (user instanceof UserData) {
      // For local users, serialize using their local ID
      done(null, { type: 'local', id: user._id });
    } else if (user instanceof GoogleUser) {
      // For Google users, serialize using their Google ID
      done(null, { type: 'google', id: user.googleId });
    } else {
      done(new Error('Invalid user type'), null);
    }
  });
  
  passport.deserializeUser((serializedUser, done) => {
    if (serializedUser.type === 'local') {
      // Deserialize local user based on their ID
      UserData.findById(serializedUser.id)
        .then((user) => {
          if (!user) {
            // User not found with the given ID
            return done(null, false);
          }
          done(null, user);
        })
        .catch((err) => {
          done(err, null);
        });
    } else if (serializedUser.type === 'google') {
      // Deserialize Google user based on their Google ID
      GoogleUser.findOne({ googleId: serializedUser.id })
        .then((user) => {
          if (!user) {
            // User not found with the given Google ID
            return done(null, false);
          }
          done(null, user);
        })
        .catch((err) => {
          done(err, null);
        });
    } else {
      done(new Error('Invalid user type'), null);
    }
  });
  
};
