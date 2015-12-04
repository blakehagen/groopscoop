
// GOOGLE AUTH ROUTES //
module.exports = function (app, passport) {

    app.get('/auth/google', passport.authenticate('google', {
        session: true,
        scope: ['https://www.googleapis.com/auth/userinfo.profile']
    }));

    app.get('/auth/google/callback', passport.authenticate('google', {
        successRedirect: '/#/user',
        failure: '/'
    }));


};