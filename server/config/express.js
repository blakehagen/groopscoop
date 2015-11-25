var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');

module.exports = function () {

    var app = express();

    app.use(cors());
    app.use(bodyParser());

    app.use(express.static(__dirname + '/public'));

    return app;
}

