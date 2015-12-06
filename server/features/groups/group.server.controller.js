var Group = require('./group.server.model');
var User = require('../users/user.server.model');
var Post = require('../posts/post.server.model');

module.exports = {
    
    addUserToGroupObject: function(req, res, next){
        Group.findByIdAndUpdate(req.params.groupId, { $push: { 
            users: req.body.users }
            }, function(err, group){
            if(err){
                res.status(500);
            }
            res.status(200).send(group);
        })
    },
    
    getGroupData: function(req, res, next){
        Group.findById(req.params.groupId).populate('users').populate('posts').exec(function (err, group) {
            if(err){
                res.status(500);
            }
            res.status(200).send(group);
        })
    },
    
    addNewPost: function(req, res, next){
        var post = new Post(req.body);
        console.log('post: ', post);
        post.save(function (err, post) {
            Group.findByIdAndUpdate(req.params.groupId, { $push: {
            posts: post._id }}, function(err, result){
                if(err){
                    res.status(500);
                }
            })
            User.findByIdAndUpdate(post.postedBy, { $push: {
            posts: post._id }}, function(err, result){
                if(err){
                    res.status(500);
                }
            })
            res.status(200).send(post);
        })
    }
        
    
    
    
    
    
    
    
};