var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var GroupSchema = new Schema({
    groupName: { type: String },
    createdOn: { type: String },
    dateCreatedNonRead: { type: Date, default: new Date() },

    users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }]
});

module.exports = mongoose.model('Group', GroupSchema);