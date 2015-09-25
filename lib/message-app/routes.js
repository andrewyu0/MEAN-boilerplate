var MessageController = require('./message.controller');
function setupRoutes(app) {
  
	// GET index
	app.get('/messages', MessageController.indexMessages);

	// CREATE POST 
  app.post('/messages/create', MessageController.createMessage);

  // READ GET individual record
  app.get('/messages/:id', MessageController.showMessage);

  // UPDATE record
  app.post('/messages/:id', MessageController.updateMessage);

  // DELETE record
	app.delete('/messages/:id', MessageController.destroyMessage);


  app.get('/open-doors', MessageController.openDoors);
  app.get('/', MessageController.disconnectHal);
}
module.exports = setupRoutes;