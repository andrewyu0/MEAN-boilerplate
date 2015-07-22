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
	$scope.myMessage = "You're not entitled to an answer, HAL";
});