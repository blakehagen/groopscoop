var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PostSchema = new Schema({
    postedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    group: { type: Schema.Types.ObjectId, ref: 'Group' },
    datePosted: { type: String },
    dateCreatedNonRead: { type: Date, default: new Date() },
    postContent: {
        message: { type: String, required: true },
        linkUrl: { type: String },
        comments: [{
            commentMsg: { type: String },
            commentLinkUrl: { type: String },
            commentPostedBy: { type: Schema.Types.ObjectId, ref: 'User' },
            commentDatePosted: { type: String },
            dateCommentCreatedNonRead: { type: Date, default: new Date() },
        }]
    }
});

module.exports = mongoose.model('Post', PostSchema);





