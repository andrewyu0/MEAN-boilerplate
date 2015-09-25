var mongoose = require('mongoose');

// ### SCHEMA DEFINITIONS ###
// Define the schema of our projects
// Schema is a way to declare intention so that mongoose knows what to expect

// Schema set up
var messageSchema = mongoose.Schema({
	content: String
});

module.exports = {
	Message : mongoose.model('Message', messageSchema)
};