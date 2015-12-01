var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var session = require('express-session');
var passport = require('passport');

module.exports = function () {

    var app = express();

    app.use(cors());
    app.use(bodyParser.json());

    app.use(session({ secret: 'i like the codez' }));

    app.use(express.static('./public'));

    return app;
};