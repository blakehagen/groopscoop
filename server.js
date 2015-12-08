// REQUIRE EXPRESS, MONGOOSE, and PASSPORT CONFIG FILES //
var express = require('./server/config/express');
var mongoose = require('./server/config/mongoose');
var passport = require('passport');
require('./server/config/passport.google')(passport);


// RUN EXPRESS & MONGOOSE CONFIG //
var app = express();
var db = mongoose();

// SOCKET.IO //
var http = require('http').Server(app);
var io = require('socket.io')(http);

// INITIALIZE PASSPORT //
app.use(passport.initialize());
app.use(passport.session());
 
// ROUTES //
require('./server/features/auth/auth.server.routes')(app, passport);
require('./server/features/users/user.server.routes')(app);
require('./server/features/groups/group.server.routes')(app);



// PROTECT ROUTES //
var requireAuth = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.redirect('/');
};



io.on('connection', function (socket) {
    console.log('User connected to socket', socket.id);
    socket.on('connectedUserGroups', function (data) {
        // console.log('connectedUserGroups data: ', data);
        var groups = data;
        console.log(groups);
        for (var i = 0; i < groups.length; i++) {
            var group = groups[i];
            socket.join(group);
            console.log('group ', group);
        };
        // console.log('socket rooms ', socket.adapter.rooms);
    });

    
    /*
        //TODO Find groups for user that just connected
        // var groups = data.groups;
       for(var i = 0; i<groups.length; i++){
           var group = groups[i];
           socket.join(group._id) //Should be a string GUID
       }
    */

    socket.on('sendNewPost', function (data) {
        console.log('on send new post ', data);
       io.to(data.group).emit('getNewPost', data);
    });
});




// PORT //
var port = process.env.PORT || 3000;

http.listen(port, function () {
    console.log('Listenting on port ' + port);
});