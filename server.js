// REQUIRE EXPRESS CONFIG AND MONGOOSE CONFIG //
var express = require('./server/config/express');
var mongoose = require('./server/config/mongoose');

//RUN EXPRESS & MONGOOSE CONFIG //
var app = express();
var db = mongoose();

// MODELS //
var User = require('./server/features/users/user.server.model')

// GOOGLE AUTH //
var googleAuth = require('./server/config/googleAuth');

// PASSPORT //
var passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());

// SERIALIZE USER //
passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

// GOOGLE STRATEGY //
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

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

// TEST ENDPOINT //
app.post('/api/test', function (req, res, next) {
    res.status(200).send(req.body.msg + ' EVERYTHING OK');
});

// GOOGLE AUTH ENDPOINTS //
app.get('/auth/google', passport.authenticate('google', {
    session: false,
    scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email']
}));

app.get('/auth/google/callback', passport.authenticate('google', {
    successRedirect: '/#/user',
    failure: '/'
}));

// USER ENDPOINTS //
app.get('/api/user', function (req, res, next) {
    res.status(200).json(req.user);
});







// PORT //
var port = process.env.PORT || 3000;

app.listen(port, function () {
    console.log('Listenting on port ' + port);
});