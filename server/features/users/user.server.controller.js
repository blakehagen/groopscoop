var User = require('./user.server.model');
var Group = require('../groups/group.server.model');

module.exports = {
    getUser: function (req, res, next) {
        var user = req.user;
        console.log(user);
        Group.find().where('users').equals(user._id).exec(function (err, result) {
            res.json([user, result]);
        })
    },

    createGroup: function (req, res, next) {
        var group = new Group(req.body);
        group.save(function (err, group) {
            res.status(200).json(group);
        });
    },

    getMyGroups: function (req, res, next) {
        Group.find().where('users').equals(req.params.id).exec(function (err, result) {
            res.json(result);

        })

    },


}