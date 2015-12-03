var userCtrl = require('./user.server.controller');

module.exports = function (app) {

    app.route('/api/v1/user')
        .get(userCtrl.getUser)
        .post(userCtrl.createGroup)


    app.route('/api/v1/users')
        .get(userCtrl.getUsers)


};