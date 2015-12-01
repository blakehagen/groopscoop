var User = require('./user.server.model');

module.exports = {
    getUser: function (req, res, next) {
        res.status(200).json(req.user);
    }
}