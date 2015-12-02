var userCtrl = require('./user.server.controller');

module.exports = function (app) {

    app.route('/user')
        .get(userCtrl.getUser)
        .post(userCtrl.createGroup)

    app.route('/user/:id')
        .get(userCtrl.getMyGroups)

};