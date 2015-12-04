var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    google: {
        email: { type: String },
        name: { type: String },
        googleId: { type: String },
        image: { type: String },
        token: { type: String }
    },
    groups: [{ type: Schema.Types.ObjectId, ref: 'Group' }],
    invitations: [{
        groupInvitedTo: { type: Schema.Types.ObjectId, ref: 'Group' },
        invitedBy: { type: 'String' }
    }]
});

module.exports = mongoose.model('User', UserSchema);