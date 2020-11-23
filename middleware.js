var express = require('express')
var favicon = require('serve-favicon')
var path = require('path')

var app = express()
app.use(favicon(path.join('./assets/favicon/favicon-16x16.png')))

// Add your routes here, etc.

var server = app.listen(process.env.PORT || 5000, function () {
    var port = server.address().port;
    console.log("Express is working on port " + port);
});