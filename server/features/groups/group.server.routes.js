var groupCtrl = require('./group.server.controller');

module.exports = function (app) {

    app.route('/api/v1/groups/:groupId')
        .post(groupCtrl.addUserToGroupObject) // --> add a userId to a group


}