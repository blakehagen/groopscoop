// EXPRESS AND MONGOOSE CONFIG FILES //
var express = require('./server/config/express');
var mongoose = require('./server/config/mongoose');

// RUN EXPRESS AND MONGOOSE //
var app = express();
var db = mongoose();



// TEST ENDPOINT //
app.post('/api/test', function(req, res, next){
    res.status(200).send(req.body.msg + ' EVERYTHING OK');
    
})







// PORT //
var port = process.env.PORT || 3000;

app.listen(port, function () {
    console.log('Listenting on port ' + port);
});