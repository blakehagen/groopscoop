var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    dateCreatedNonRead: { type: Date, default: new Date() },
    google: {
        email: { type: String },
        name: { type: String, required: true, unique: true },
        googleId: { type: String, required: true, unique: true },
        image: { type: String },
        token: { type: String }
    },
    groups: [{ type: Schema.Types.ObjectId, ref: 'Group', unique: true }],
    invitations: [{
        groupInvitedTo: { type: Schema.Types.ObjectId, ref: 'Group' },
        invitedBy: { type: String }
    }],
    posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }]
});

module.exports = mongoose.model('User', UserSchema);