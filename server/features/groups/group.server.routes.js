var groupCtrl = require('./group.server.controller');

module.exports = function(app){
    
    app.route('/group')
        .post(groupCtrl.createGroup); 
};