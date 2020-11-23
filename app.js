const express = require('express');
const app = express();

var PORT = process.env.PORT || 3030;
var favicon = require('serve-favicon');
var PATH = require('path');

var cors = require('cors');
app.use(cors());

app.use(favicon(PATH.join(__dirname, 'public', 'favicon.ico')))

app.use(express.static('client'));

app.listen(PORT, () => {
    console.log("User Login Example up and running on port " + PORT);
});