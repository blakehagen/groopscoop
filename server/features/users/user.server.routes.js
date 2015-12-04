var userCtrl = require('./user.server.controller');

module.exports = function (app) {

    app.route('/api/v1/user')
        .get(userCtrl.getUser) // gets users info and groups on load
        .post(userCtrl.createGroup) // posts a new group that user created

    app.route('/api/v1/users')
        .get(userCtrl.getUsers) // gets users to search

    app.route('/api/v1/user/invite')
        .post(userCtrl.sendInvite) // posts an invite to a user
        .get(userCtrl.getInvites) // gets invites for a user

    app.route('/api/v1/user/invite/accept')
        .post(userCtrl.acceptInvite) // user accepts invite and posts to them
        
    app.route('/api/v1/user/groups')
        .get(userCtrl.getGroups) // get users groups (after invite accpepted, eg.)


};