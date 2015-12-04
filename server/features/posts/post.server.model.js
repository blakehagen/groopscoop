var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PostSchema = new Schema({
    postedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    group: { type: Schema.Types.ObjectId, ref: 'Group' },
    datePosted: { type: String },
    postContent: {
        message: { type: String },
        linkUrl: { type: String },
        comments: [{
            commentMsg: { type: String },
            commentLinkUrl: { type: String },
            commentPostedBy: { type: Schema.Types.ObjectId, ref: 'User' },
            commentDatePosted: { type: String }
        }]
    }
});

module.exports = mongoose.model('Post', PostSchema);





