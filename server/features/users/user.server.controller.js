var User = require('./user.server.model');
var Group = require('../groups/group.server.model');

module.exports = {
    getUser: function (req, res, next) {
        var user = req.user;
        Group.find().where('users').equals(user._id).exec(function (err, result) {
            user.groups.push(result);
            res.json([user, result]);
        })
    },

    createGroup: function (req, res, next) {
        var group = new Group(req.body);
        console.log('req.body ', req.body);
        group.save(function (err, group) {
            User.findByIdAndUpdate(req.body.users[0], {$push: {groups : group._id}}, function(err, result){
                if(err){
                    res.send(500);
                }
            })
            res.status(200).json(group);
        });
    }


}