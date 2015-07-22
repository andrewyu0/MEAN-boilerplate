// Define the resource that interfaces with Restangular
app.factory('MessageResource', ['Restangular', 'AbstractResource',
  function (restangular, AbstractResource) {
    function MessageResource() {
    	// setting 'messages' as the base url
      AbstractResource.call(this, restangular, 'messages');
    }
    AbstractResource.extend(MessageResource);
    return new MessageResource();
  }
]);

app.controller('MainCtrl', function($scope, Restangular, MessageResource){
	$scope.myMessage = {content:""};

	// GET all messages
	$scope.messages = MessageResource.getList();

	// POST 
	$scope.createMessage = function(){
		MessageResource.create($scope.myMessage).then(function(){
      // refreshes the list 
      $scope.messages = MessageResource.getList();
      // reset current myMessage
      $scope.myMessage = {content:""};
		});
	};

});