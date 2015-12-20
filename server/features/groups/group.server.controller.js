var Group = require('./group.server.model');
var User = require('../users/user.server.model');
var Post = require('../posts/post.server.model');
var rp = require('request-promise');
var embedly = require('../../config/keys/embedlyKeys');



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
        Group.findById(req.params.groupId).populate('users').populate({
            path: 'posts',
            populate: {path: 'postedBy'}}).exec(function (err, group) {
            if(err){
                res.status(500);
            }
            res.status(200).send(group);
        })
    },
    
        addNewPost: function(req, res, next){
            var post = new Post(req.body);
            if(post.postContent.linkUrl){
                    var options = {
                    uri: 'http://api.embed.ly/1/oembed?key=' + embedly.embedly.key + '&url=' + post.postContent.linkUrl,
                    json: true
                };
                rp(options).then(function (data){
                    var embedlyData = data;
                    // console.log('embedly data on serverside: ', embedlyData);
                    // if(embedlyData.url.toLowerCase().match(/\.(gif)/g)){
                    //     post.postContent.embedlyImg = embedlyData.url;
                    // }
                    post.postContent.embedlyImg = embedlyData.thumbnail_url;
                    // post.postContent.embedlyHtml = embedlyData.html;
                    post.postContent.embedlyType = embedlyData.type;
                    console.log('new post if linkUrl ', post.postContent);
                    //  if (post.postContent.embedlyImg.toLowerCase().match(/\.(gif)/g)) {
                    //     post.postContent.embedlyType = 'gif';
                    //     console.log('1');
                    //  }
                    //  else if (embedlyData.url.toLowerCase().match(/\.(gif)/g)) {
                    //     post.postContent.embedlyType = 'gif';
                    //     post.postContent.embedlyImg = embedlyData.url;
                    //     console.log('2');
                    //  }
                    //  else if (post.postContent.linkUrl.toLowerCase().match(/\.(gif)/g)) {
                    //     post.postContent.embedlyType = 'gif';
                    //     console.log('3');
                    //  }
                     console.log('postContent: ', post.postContent);
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
                    })
                    console.log('4');
                    res.status(200).send(post);
                }).catch(function(err){
                    res.status(500);    
                });

            } 
            else {
            // console.log('new post ', post);
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
    }
    
    
};