var OdysseyController = require('./odyssey.controller');
function setupRoutes(app) {
  
	// GET index
	app.get('/messages', OdysseyController.indexMessages);

	// CREATE POST 
  app.post('/messages/create', OdysseyController.createMessage);

  // READ GET individual record
  app.get('/messages/:id', OdysseyController.showMessage);

  // UPDATE record
  app.post('/messages/:id', OdysseyController.updateMessage);

  // DELETE record
	app.delete('/messages/:id', OdysseyController.destroyMessage);


  app.get('/open-doors', OdysseyController.openDoors);
  app.get('/disconnect-hal', OdysseyController.disconnectHal);
}
module.exports = setupRoutes;