var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var User = require('../features/users/user.server.model');
var googleAuth = require('./keys/googleAuthKeys');

module.exports = function (passport) {
    
    // SERIALIZE USER //
    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    passport.deserializeUser(function (user, done) {
        done(null, user);
    });

    // GOOGLE PASSPORT STRATEGY //
    passport.use(new GoogleStrategy({
        clientID: googleAuth.googleAuth.clientID,
        clientSecret: googleAuth.googleAuth.clientSecret,
        callbackURL: googleAuth.googleAuth.callbackURL
    }, function (req, accessToken, refreshToken, profile, done) {

        User.findOne({ 'google.id': profile.id }, function (err, user) {
            if (user) {
                console.log('Google user found in database: ', user);
                done(null, user);
            } else {
                console.log('Google user not found in database');

                user = new User()
                user.google.id = profile.id;
                user.google.token = accessToken;
                user.google.name = profile.displayName;
                user.google.image = profile._json.image.url;
                user.google.email = profile.emails[0].value;
                console.log('new user created: ', user);

                user.save();
                done(null, user);
            }
        });
    }));
};