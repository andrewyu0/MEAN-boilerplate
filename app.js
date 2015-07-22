var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

// Database set up
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

// notification whether connection successful or not 
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  console.log("mongoose connection successful!")
});

// Schema set up
var messageSchema = mongoose.Schema({
	content: String
});

var Message = mongoose.model('Message', messageSchema);



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
var setupOdysseyRoutes = require('./lib/odyssey/routes');
setupOdysseyRoutes(app);

// Expose /lib so we can use it on the layout
app.use(express.static(path.join(__dirname, 'lib')));

var server = app.listen(4000, function(){
 console.log('Express server listening on port 4000');
});