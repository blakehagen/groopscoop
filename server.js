// EXPRESS AND MONGOOSE CONFIG FILES //
var express = require('./config/express');
var mongoose = require('./config/mongoose');

// RUN EXPRESS AND MONGOOSE //
var app = express();
var db = mongoose();











// PORT //
var port = process.env.PORT || 3000;

app.listen(port, function () {
    console.log('Listenting on port ' + port);
});