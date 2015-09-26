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

app.controller('MainCtrl', function($scope, $location, Restangular, MessageResource){
	
  $scope.myMessage = {content:""};

	$scope.messageHidden = true;
	$scope.toggleMessageHidden = function(){
		$scope.messageHidden = !$scope.messageHidden;
		console.log($scope.messageHidden)
	}

	// GET all messages
	$scope.messages = MessageResource.getList();

	// GET one
	$scope.getMessage = function(id){
		$scope.message = MessageResource.get(id).then(function(data){
			$scope.currentMessage = data;
			console.log($scope.currentMessage)
		});
	};

	// POST 
	$scope.createMessage = function(){
		MessageResource.create($scope.myMessage).then(function(){
      // refreshes the list 
      $scope.messages = MessageResource.getList();
      // reset current myMessage
      $scope.myMessage = {content:""};
		});
	};

  // UPDATE 
  $scope.updateMessage = function(){
    MessageResource.update($scope.currentMessage).then(function(data){
      $scope.toggleMessageHidden();
      $scope.messages = MessageResource.getList();
      $location.path('/');
    });
  };

  // DELETE
  $scope.deleteMessage = function(){
    if(window.confirm('Are you sure?')){
      MessageResource.remove($scope.currentMessage).then(function(){
      	$scope.toggleMessageHidden();
	      $scope.messages = MessageResource.getList();
        $location.path('/');
      });
    }
  }



});



// STATES to be used
app.config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider
    .state('messages', {
      abstract: true,
      url: '/messages'
    })

    .state('messages.item', {
    	url: '/{id}',
    	views : {
    		'@' : {
    			templateUrl : 'views/message.html'
    		}
    	}
    });
  }
]);