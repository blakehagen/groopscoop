var commentsCtrl = require('./comments.server.controller');

module.exports = function(app){
    
    app.route('/api/v1/comments/:postId')
        .get(commentsCtrl.getPostComments) // --> get comments for individual post
        .post(commentsCtrl.addNewComment) // --> add a new comment for post
    
    
    
    
}