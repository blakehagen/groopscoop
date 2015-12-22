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
        embedlyImg: { type: String },
        // embedlyHtml: { type: String },
        embedlyType: { type: String },
    },
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }]
});

module.exports = mongoose.model('Post', PostSchema);





