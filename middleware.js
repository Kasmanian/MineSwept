var express = require('express')
var favicon = require('serve-favicon')
var path = require('path')

var app = express()
app.use(favicon(path.join('./assets/favicon/favicon-16x16.png', 'public', 'favicon.ico')))

// Add your routes here, etc.

app.listen(3000)