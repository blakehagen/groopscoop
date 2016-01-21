var Comment = require('./comments.server.model');
var Post = require('../posts/post.server.model');
var Group = require('../groups/group.server.model');
var User = require('../users/user.server.model');

module.exports = {
    
    getPostComments: function(req, res, next){
        Post.findById(req.params.postId).populate(
            {
            path: 'comments',
            populate: { path: 'postedBy',
                        select: 'google.name google.image'}}
        )
        .exec(function(err, post){
            if(err){
                res.status(500);
           }
            res.status(200).json(post.comments);
        })
    },
    
    addNewComment: function(req, res, next){
        // console.log(req.body);
        var comment = new Comment(req.body);
        comment.save(function (err, comment){
            if(err){
                res.status(500);
            };
            // console.log('comment ', comment);
            Post.findByIdAndUpdate(req.params.postId, { $push: {
            comments: comment._id }}, function(err, result){
                if(err){
                    res.status(500);
                }
             })
             User.findByIdAndUpdate(comment.postedBy, { $push: {
                 comments: comment._id }}, function(err, result){
                 if (err){
                     res.status(500);
                 }
             })
        })
        res.status(200).json(comment);
    }
    
    
    
    
    
};