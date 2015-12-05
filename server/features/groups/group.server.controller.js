var Group = require('./group.server.model');
var User = require('../users/user.server.model');

module.exports = {
    
    addUserToGroupObject: function(req, res, next){
        Group.findByIdAndUpdate(req.params.groupId, { $push: { 
            users: req.body.users}
            }, function(err, group){
            if(err){
                res.status(500);
            }
            res.status(200).send(group);
        })
    },
    
        getGroupData: function(req, res, next){
            Group.findById(req.params.groupId).populate('users').exec(function (err, group) {
            if(err){
                res.status(500);
            }
            res.status(200).send(group);
        })
    }
    
    
    
    
    
    
    
    
};