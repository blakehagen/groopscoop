var mongoose = require('mongoose');

module.exports = function () {
    var mongoUri = 'mongodb://grpscp:grpscp@ds041432.mongolab.com:41432/groupscoop';
    mongoose.connect(mongoUri);
    mongoose.connection.once('open', function () {
        console.log('Connection to mongoDB successful')
    });
};