var express      = require('express');
var app          = express();
var path         = require('path');
var bodyParser   = require('body-parser');
var methodOverride = require('method-override');



/*************
 * DB SET UP *
 *************/

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/store');
// notification whether connection successful or not 
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  console.log("mongoose connection successful!")
});

// Load models 
require('./lib/schemas');


/*****************
 * APP SET UP 
 *****************/
// This is where we mount middleware functions at paths, app.use, etc

app.set('view engine', 'jade');
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

// Expose /lib so we can use it on the layout easily
app.use(express.static(path.join(__dirname, '/lib')));
// Expose /bower_components so we can use it on the layout easily
app.use(express.static(path.join(__dirname, '/bower_components')));

/**********
 * SUB APP 
 **********/

/*
  Include the subapps
  
  This allows us to mount subapplications
      - At specific URLS
      - Behind Authentication
      - Behind middleware
*/

app.use(require('./lib/message-app'));


var server = app.listen(4000, function(){
 console.log('Express server listening on port 4000');
});