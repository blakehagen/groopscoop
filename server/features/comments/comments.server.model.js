var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommentSchema = new Schema({
    post: { type: Schema.Types.ObjectId, ref: 'Post' },
    postedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    datePosted: { type: String },
    dateCreatedNonRead: { type: Date, default: new Date() },
    commentMessage: { type: String },
    commentLinkUrl: { type: String },
    commentEmbedlyImg: { type: String },
    commentEmbedlyType: { type: String }
});

module.exports = mongoose.model('Comment', CommentSchema);