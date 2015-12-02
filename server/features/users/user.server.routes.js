var userCtrl = require('./user.server.controller');

module.exports = function(app){
    
    app.route('/user')
        .get(userCtrl.getUser); 
};