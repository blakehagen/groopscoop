var groupCtrl = require('./group.server.controller');

module.exports = function (app) {

    app.route('/api/v1/groups/:groupId')
        .post(groupCtrl.addUserToGroupObject) // --> add a userId to a group
        .get(groupCtrl.getGroupData) // --> getting group info (includes users and posts)
              
    app.route('/api/v1/groups/:groupId/post')
        .post(groupCtrl.addNewPost) // --> add post to group


}

