
// GOOGLE AUTH ROUTES //
module.exports = function (app, passport) {

    app.get('/auth/google', passport.authenticate('google', {
        session: false,
        scope: ['https://www.googleapis.com/auth/plus.login']
    }));

    app.get('/auth/google/callback', passport.authenticate('google', {
        successRedirect: '/#/user',
        failure: '/'
    }));
    

};