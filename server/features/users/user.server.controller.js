var User = require('./user.server.model');
var Group = require('../groups/group.server.model');

module.exports = {
    // GETS AUTHENTICATED USER AND THEIR GROUPS //
    getUser: function (req, res, next) {
        var user = req.user;
        Group.find().where('users').equals(user._id).exec(function (err, result) {
            user.groups.push(result);
            res.json([user, result]);
        })
    },

    // AUTH'D USER CREATES GROUP AND USERID POPULATED TO GROUP //
    createGroup: function (req, res, next) {
        var group = new Group(req.body);
        console.log('req.body ', req.body);
        group.save(function (err, group) {
            User.findByIdAndUpdate(req.body.users[0], { $push: { groups: group._id } }, function (err, result) {
                if (err) {
                    res.status(500);
                }
            })
            res.status(200).json(group);
        });
    },

    // GETS ALL USERS IN DB FOR SEARCH/INVITE ON FRONT //
    getUsers: function (req, res, next) {
        User.find().exec(function (err, users) {
            var userData = [];
            for (var i = 0; i < users.length; i++) {
                // ONLY SEND NAME/ID/GROUPS //
                userData.push({
                    name: users[i].google.name,
                    id: users[i]._id,
                    groups: users[i].groups
                })
            }
            if (err) {
                res.status(500);
            }
            res.status(200).json(userData)
        })
    }


}