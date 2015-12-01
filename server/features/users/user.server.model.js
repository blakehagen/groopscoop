var mongoose = require('mongoose');

var UserSchema = mongoose.Schema({
    google: {
        id: String,
        token: String,
        email: String,
        name: String,
        image: String
    }
});

module.exports = mongoose.model('User', UserSchema);