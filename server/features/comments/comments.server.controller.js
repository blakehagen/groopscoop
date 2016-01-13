var Comment = require('./comments.server.model');
var Post = require('../posts/post.server.model');
var Group = require('../groups/group.server.model');
var User = require('../users/user.server.model');

module.exports = {
    
    getPostComments: function(req, res, next){
        Post.findById(req.params.postId).populate({
            path: 'comments',
            populate: {path: 'postedBy'}})
        .exec(function(err, post){
            if(err){
                res.status(500);
           }
           // Strip out unneccessary data //
           for(var i = 0; i < post.comments.length; i++){
               post.comments[i].postedBy.posts = null;
               post.comments[i].postedBy.comments = null;
               post.comments[i].postedBy.groups = null;
               post.comments[i].postedBy.invitations = null;
               post.comments[i].postedBy.google.googleId = null;      
               post.comments[i].postedBy.google.email = null;   
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