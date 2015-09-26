var express      = require('express');
var app          = express();
var path         = require('path');
var bodyParser   = require('body-parser');
var methodOverride = require('method-override');

// Database set up
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/store');

// notification whether connection successful or not 
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  console.log("mongoose connection successful!")
});

require('./lib/schemas');


// body parser for req.body
app.use(bodyParser());
// for method override on forms
app.use(methodOverride(function(req, res){
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method
    delete req.body._method
    return method
  }
}));

app.set('views', path.join(__dirname, 'lib', 'views'));
app.set('view engine', 'jade');

var setupMessageApp = require('./lib/message-app/routes');
setupMessageApp(app);

// Expose /lib so we can use it on the layout
app.use(express.static(path.join(__dirname, '/lib')));
// Expose /bower_components so we can use it on the layout
app.use(express.static(path.join(__dirname, '/bower_components')));


var server = app.listen(4000, function(){
 console.log('Express server listening on port 4000');
});