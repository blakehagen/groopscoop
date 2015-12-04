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
// require('./server/features/groups/group.server.routes')(app);

// PROTECT ROUTES //
var requireAuth = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.redirect('/');
};

// SOCKET.IO //
io.on('connection', function (socket) {
    console.log('USER CONNECTED TO SOCKET');
    socket.on('sendMsg', function (data) {
        io.sockets.emit('getMsg', data)
    })
    socket.on('createNewGroup', function (data) {
        socket.emit('getGroups', data)
    })
});




// PORT //
var port = process.env.PORT || 3000;

http.listen(port, function () {
    console.log('Listenting on port ' + port);
});