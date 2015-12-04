var User = require('./user.server.model');
var Group = require('../groups/group.server.model');

module.exports = {
    // GETS AUTHENTICATED USER AND THEIR GROUPS ON PAGE LOAD //
    getUser: function (req, res, next) {
            User.findById(req.user._id).populate('groups invitations').exec(function(err, user){
                if(err){
                    res.status(500);
                }
            res.status(200).json(user);
        })
    },

    // AUTH'D USER CREATES GROUP AND USERID POPULATED TO GROUP //
    createGroup: function (req, res, next) {
        var group = new Group(req.body);
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
    },
    
    // POST NEW INVITE TO A USER //
    sendInvite: function (req, res, next) {
        var inviteData = req.body.invitation;
        User.findByIdAndUpdate(inviteData.targetUserId, { $push: { invitations: { 
            groupInvitedTo: inviteData.invitedTo,
            invitedBy: inviteData.senderName }
            }}, function (err, result) {
            if (err) {
                res.status(500).json(err);
            }
            res.status(200).send("INVITE SEND SUCCESS!");
        });
    },
    
    // GET USER INVITES //
    getInvites: function(req, res, next){
        var id = req.session.passport.user._id;
        User.findById(id).populate('invitations').populate('invitations.groupInvitedTo').exec(function(err, user){
            res.status(200).json(user.invitations);
        })
    },
    
    // ACCEPT INVITE //
    acceptInvite: function(req, res, next){
        var inviteData = req.body;
        // console.log('inviteData: ', inviteData);
        var groupId = req.body.inviteData.groupInvitedTo._id;
        User.findByIdAndUpdate(inviteData.acceptedBy, { $push: { groups: inviteData.inviteData.groupInvitedTo._id } }, function(err, result){
            if(err){
                res.status(500);
            }

            User.findByIdAndUpdate(inviteData.acceptedBy, {
                $pull: { invitations : { groupInvitedTo: groupId }
                }},
                function(err, result){
                if(err){
                    res.send(500);
                }
            })
            res.status(200).send('INVITE ACCEPTED!');
        });
    },
    
    // GETS ALL GROUPS USER BELONGS TO //
    getGroups: function (req, res, next) {
        User.find().populate('groups').exec(function (err, groups) {
            if (err) {
                res.status(500);
            }
            res.status(200).json(groups)
        })
    },




};