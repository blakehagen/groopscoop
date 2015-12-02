var Group = require('./group.server.model');

module.exports = {
    createGroup: function (req, res, next) {
        var group = new Group(req.body);
        group.save(function (err, group) {
            return res.status(200).send('Group Created: ' + group);
        })
    }

};