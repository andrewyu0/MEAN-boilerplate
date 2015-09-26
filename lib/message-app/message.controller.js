var mongoose = require('mongoose');
var Message = mongoose.model('Message');

module.exports = {
  openDoors : function(req, res){
    res.send("I'm sorry, Dave. I'm afraid I can't do that.");
  },
  
  // Find all messages
  showMessagesPage : function(req, res){
			res.render('messages', {
				title    : 'E-commerce Store'
			});
  },

  // DB Calls

  indexMessages : function(req, res){
  	console.log("indexMessages invoked")
    Message.find({}, function(err, doc){
    	console.log(doc)
    	res.json(doc)
    });
  },  

  createMessage : function(req, res){
  	
  	console.log("This is req.body")
  	console.log(req.body)

  	var newMessage = req.body;

  	var newMessage = new Message(newMessage);

  	newMessage.save(function(err){
      console.log("in the save function")
  		res.redirect('/');
  	});
  },

  showMessage : function(req, res){
  	var messageId = req.params.id;
  	Message.findById(messageId, function(err, doc){
      res.json(doc);
  	});
  },

  updateMessage : function(req, res){
    var messageId = req.params.id;
    var updateMessageVal = req.body;
    Message.update({_id:messageId}, updateMessageVal,
      function(err){
        res.redirect('/messages/' + messageId);
    });
  },
  
  destroyMessage : function(req, res){
    var messageId = req.params.id;
    Message.remove({_id: messageId}, function(err){
      res.json();
    });
  },

};