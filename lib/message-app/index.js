var express = require("express"),
    app     = module.exports = express();

app.set('views', __dirname + '/views');

require('./routes')(app);

console.log("message-app loaded")