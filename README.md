## Angular CRUD Tutorial 

This tutorial assumes you've completed [Part 1](https://medium.com/hello-there-expressjs/hello-expressjs-a5bff26962fa) and [Part 2](https://medium.com/hello-there-expressjs/lets-get-fancy-6263ce2dd6b3) basic Express tutorials.

You can think of this tutorial as Part 3. This tutorial itself will be broken into several parts: 

## PART 1:  Express CRUD routes, Mongo Set up 

Before we angularize everything, we're going to create a basic CRUD application with Express, and hook up Mongo as our database. 

Mongo is a document based data base

We'll want to set up a database so we can store and retrieve data. Our end goal for this tutorial is to get an application that Creates, Reads, Updates, and Deletes. And to be able to control these actions with angular

Steps (need to expand these, go more into detail):
* Install mongo 
* First add mongoose to package.json - explain what mongoose is
* npm install 

## Setup database

* Follow instructions here http://mongoosejs.com/docs/

### Require mongoose, define schemas

Once we've added mongoose to our **package.json**, add it in **app.js**. We'll also have to define a schema for our messages that we'll be shooting back at HAL. Let's keep it simple and have one property for now, **content**, which will be a string 

@TODO: GO MORE IN DEPTH HERE

```
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

```
@TODO: More indepth

### Using our models in our controllers

Now that we have the data base set up, we want to include the set up in our controller too, so that we can start reading and writing from the DB with controller actions. In **odyssey-controller.js** add the following lines. With the **Message** model now available in the controller, we have various Mongoose commands at our disposal that we will be using

```
var mongoose = require('mongoose');
var Message = mongoose.model('Message');
```
### Routes in Express

So far, we've only created GET requests that render our page. We'll now create a POST route that will allow us to POST a message and save it to the database that we just set up


@andrew: Review form syntax, creating forms

We'll start with post so that we have records to work with
	
### POST

* Create a controller action createMessage that writes to the DB 
	* will call on the mongoonse save() function
* Create a post route '/responses/create' in routes
* Create a form that will post to this route

**Impt Note:** Body parser has changed between Express 3 and 4. It is now required as a separate library
We need this for `req.body` that we'll be receiving from the client
* body-parser deprecated bodyParser: use individual json/urlencoded middlewares 
* https://www.npmjs.com/package/body-parser

@TODO: Find a link that explains this, go more into details

```
// in app.js
var bodyParser = require('body-parser');

// body parser for req.body
app.use(bodyParser());

Code needed 

// form on disconnect.jade
form(name="", method="post", action="/messages/create")
	input(type="text", placeholder="New message", name="content")
	button(type="submit") Create New Message

// route in routes.js
// POST 
app.post('/messages/create', OdysseyController.createMessage);

// controller writes to db
// @TODO explain what's going on here
createMessage : function(req, res){
	var newMessage = req.body;
	var newMessage = new Message(newMessage);
	newMessage.save(function(err){
    console.log("in the save function")
		res.redirect('/disconnect-hal');
	});
}
```

### Check if it saved in the database
Before we render the record you just created in the database, lets use the terminal to see if the record saved! If you do `show collections`, you'll now see that the `messages` collection now appears, since we have a record in there.

@TODO: Take opportunity to go into mongoose call here

``` 	
> mongo
> show collections
messages
> db.messages.find({})
{
	"_id" : ObjectId("55aeb6a300ebbfcf86e9ecc5"),
	"content" : "First Message",
	"__v" : 0
}
```
Great! We see that our record is in the database. This means everything is hooked up; from the client form, to the route, to the controller, to the database - we were able to write to the database from the form. Let's delve into a couple of other CRUD actions now 


### INDEX

Let's grab all the records that we have in the database and show them on our view. We'll use Express to do this first to soldify our understanding of the routes on the server side before we convert everything to angular

@TODO: What's express doing here exactly?

Requirements
* List all messages on the main `/disconnect-hal` page
* Create controller that will grab all the Message records
* Create GET route that will hit that controller
* Show records on the page (empty for now)

```
	indexMessages : function(req, res){
	  Message.find({}, function(err, doc){
	    res.json(doc);
	  });
	}

	// GET index
	app.get('/messages', OdysseyController.indexMessages);
```

Checkout `localhost:3000/messages` and you should see a JSON file of all the records. Great, we know that the route, controller, db connection are all in place. Now, let's modify this a little bit so that we have the records available to us when we go to the main `/disconnect-hal` page. We'll be reverting this back later on in the angular tutorial. `disconnectHal` controller now looks like this: 

@TODO: Explain what's going on here; find all records, all available as 'messages' on view

	// Find all records, and render the view 'disconnect'
	disconnectHal : function(req, res){
	  Message.find({}, function(err, doc){
			console.log(doc)
			res.render('disconnect', {
				title    : 'Disconnecting Hal', 
				messages : doc
			});
	  });
	}

And on the view, now that we have messages available, we can render them using express 

Add this below HAL's "What do you think you are doing dave". View should look something like this: 

	extend ./layout
	block content
		h1= title
		img(src='http://bit.ly/VqvT6b', width='100', height='100')
		p HAL: What do you think you are doing dave
		h2 Messages
		table.table
			each message in messages
				tr
					td=message.content
		form(name="", method="post", action="/messages/create")
			input(type="text", placeholder="New message", name="content")
			button(type="submit") Create New Message


Start creating more messages - this is what you should see! We now officially have an application that can create messages, write them to the database, retrieve and show them 

![](http://i.imgur.com/AM10Y6r.png)


<br>
<br>

### SHOW

Let's do an individual page for each response

* create message.jade
* create controller action that will show the page showResponse
* create route for the individual record 

create route for the get action 

	app.get('/messages/:id', OdysseyController.showMessage);

controller 

	showMessage : function(req, res){
		var messageId = req.params.id;
		Message.findById(messageId, function(err, doc){
	    res.render('message', {
	      message: doc,
	      action : 'messages/' + messageId
			});
		});
	}

Add link for each entry on disconnect.jade, this will take you to a separate page for each record

	table.table
		each message in messages
			tr
				td
					a(href='/messages/#{message._id}')=message.content


After all this, you should be able to render a separate view for each record. Great!

@TODO: Talk about mounting views - why on octo avenger it works to do 'invoices/show'. I personally have to soldify this (what was this again? Don't remember exactly what I was writing here)

<br>
<br>

### UPDATE
EDIT functionality on the same page 

@TODO: Why do we do a POST here rather than a PUT?

Set up a post route that prepares for the update controller action

	app.post('/messages/:id', OdysseyController.updateMessage);

update controller action

	updateMessage : function(req, res){
	  var messageId = req.params.id;
	  var updateMessageVal = req.body;
	  Message.update({_id:messageId}, updateMessageVal,
	    function(err){
	      res.redirect('/messages/' + messageId);
	  });
	}

Now, create the form on the page 

	form(method='post' action='/messages/#{message.id}')
		input(type='text' placeholder='new message here' name='content')
		button(type='submit') Update your message!

<br>
<br>

### DELETE

Important : Need to add methodOverride [Stackoverflow Post](http://stackoverflow.com/questions/9859287/expressjs-support-for-method-delete-and-put-without-the-methodoverride) <br>
Had to apply this custom logic. Really annoying, in order to get delete working [See this post as well](http://stackoverflow.com/questions/24019489/node-js-express-4-x-method-override-not-handling-put-request)

Add the following to app.js, as well as additional code in the post above
	var methodOverride = require('method-override');

Add the following code to get the DELETE functionality

	// Route

	// DELETE record
	app.delete('/messages/:id', OdysseyController.destroyMessage);

	// Controller
	destroyMessage : function(req, res){
	  var messageId = req.params.id;
	  Message.remove({_id: messageId}, function(err){
	    console.log("successfully deleted record")
	    res.redirect('/disconnect-hal');
	  });
	}

And add a delete form to the `message.jade` view. Your individual show page should look like this

	extend ./layout
	block content
		h1=message.content 
		form(method='post' action='/messages/#{message.id}')
			input(type='text' placeholder='new message here' name='content')
			button(type='submit') Update your message!	
		form(action='/messages/#{message.id}' method="post")
			input(type='hidden' name='_method' value='delete')
			button(type='submit') Delete	
		a(href='/disconnect-hal') back to main page


### FINAL NOTE: 

At this point, we've implemented a full fledge basic CRUD app, set up mongo. We are good to go. The point of this tut was to get routing up and running and to get the flow down. We're now goingto angularize this bad boy. We have the routes, server controller actions, and DB set up that we will use and connect to with angular

<br><br><br>


## PART 2: ANGULARIZE ME!

<br><br>
### Requirements 

In this section, we'll be building out the angular portion so we can have dynamic views in our application. We'll create the necessary javascript files, include them on our layout, and start building out the angular module. 

First, we need to include angular to our application. Add CDN to layout.jade. You'll need to add this to layout.jade. CDN from angular site. We're on 1.4.3

	script(src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.3/angular.min.js")

<br><br>
### Create app

This is where we start writing our client side JS code. To do this we'll create a js folder that will contain all the client side HS. Create a folder and then a file in the folder: **lib/js/main.js**

We'll tell our application where the client side javascript files are. Include this line in **app.js**: 
	
	app.use(express.static(path.join(__dirname, 'lib')));

Now, we can include the **main.js** file we just created on the layout.

<br><br>
### Angular Module : main.js

This is where our angular module will live. We create the app `myApp` with the following line of code: 

	var app = angular.module('myApp', []);

This line creates Angular module named myApp, dont worry about the empty array as the second argument for now. Instantiate the **myApp** module by passing the name of our app as the value in our **layout.jade**. This will allow us to use the app on the entire page. **layout.jade** should look like this: 

	html(ng-app='myApp')
	  head
	    title= 'Hello World'
	    script(src='https://ajax.googleapis.com/ajax/libs/angularjs/1.0.7/angular.min.js')
	    script(src='js/main.js')    
	  body
	    block content

Now we can start building out the rest of the application 

<br><br>
### Angular Controller

We're going to create an angular controller so that we can dynamically manipulate DOM elements on our view and write a message back to HAL. We'll first create the controller in **main.js** and separate our concerns in a little bit. Let's call it **MyCtrl**. We're going to set a message on $scope so that we can use it on the view.
<br>
@TODO: Go more indepth into $scope here

```
var app = angular.module('myApp', []);

app.controller('MyController', function($scope){
	$scope.myMessage = "You're not entitled to an answer, HAL";
});

```

Add ng-controller on the **body** on layout, that way we can use it everywhere in the application
  
``` 
body(ng-controller="MainCtrl")
```

To check whether the module, controller are set properly add a paragraph on the **disconnect.jade** view and place the variable we just set on $scope on the controller in the following format:

```
p Dave:{{myMessage}}	
```

Now, if we look at the view, we'll see that the message that we wrote appears on the view. 
<br><br>
![](http://i.imgur.com/3y2vCOJ.png)

Congratulations, we've bounded our first element to the DOM using angular!  This means our view, client side controller, and angular module are all configured together properly. At this point, `disconnect.jade` looks like this: 

```
extend ./layout
block content
	h1= title
	img(src='http://bit.ly/VqvT6b', width='100', height='100')
	p HAL: What do you think you are doing dave
	p Dave: {{myMessage}}
	h2 Messages
	table.table
		each message in messages
			tr
				td
					a(href='/messages/#{message._id}')=message.content
	form(name="", method="post", action="/messages/create")
		input(type="text", placeholder="New message", name="content")
		button(type="submit") Create New Message

```
<br><br>


## PART 3: Angular Routing 

Up to this point we've set up routes with express. Now we're going to angularize it using Restangular and ui-router. Why angularize it? So that we can send data back and forth from $scope 

### Bower 

We'll use Bower as our client side package manager. Bower is a client side package manager. Think of it like node and package.json. This [quick tutorial](http://bower.io/docs/creating-packages) will give you a nice walkthrough, follow the steps and create a bower.json file 

`bower init`, walk through all the steps and you should see a `bower.json` file created in the application 

### Restangular

Now that we have bower installed, we can use it to install Restangular as a dependency
What is [Restangular](https://github.com/mgonto/restangular) : Restangular is an AngularJS service which makes GET/POST/PUT/DELETE requests simpler and easier. 

`bower install restangular` 

We've no added Restangular as a dependency and can start using it 

### Separating concerns

Similarly to how we split out controllers and routes on the server side, lets do the same for Angular client side. We want the /js folder to look like this: 

* js
	* controllers
		* main-controller.js
	* factory.js
	* main.js

Include restangular from bower components as well. Expose `bower_components` so that we can include on the layout
Be sure to include _everything_, especially the lodash library, which Restangular uses

Include the new javascript files on the layout

```
html(ng-app='myApp')
  head
    title= 'Hello World'
    script(src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.3/angular.min.js")
    script(src='/lodash/lodash.min.js')
    script(src="/restangular/dist/restangular.min.js")
    script(src="/js/main.js")    
    script(src="/js/factory.js")    
    script(src="/js/controllers/main-controller.js") 
    link(href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css", rel="stylesheet")
  body(ng-controller="MainCtrl")
    block content
```

We also have to inject it on the actual `angular.module` on `main.js` (as well as the controller, which we will do shortly)

```	
var app = angular.module('myApp', ['restangular']);
```

### Controllers

Let's start by moving things out of `main.js`. Controllers will be in their own file. We've set the controller on app. This is where we'll be interacting with the client - keeping things as slim as possible, with the minimal amount of logic

Your `js/controllers/main-controllerjs` file should look like this: 

	app.controller('MainCtrl', function($scope){
		$scope.myMessage = "You're not entitled to an answer, HAL";
	});


### Factory

@TODO: Explain what a Factory is
@TODO: Cover dependency injection (DI), services, etc https://docs.angularjs.org/guide/services


We're going to create an abstract model that we can use instantiate and use in our controller to route. Essentially, what's going on in here is that we're using Restangular to create routes. Check out the documentation for more information. We create `AbstractResource` and create methods that can be used any time we create a new Resource. We're going to do this next in the controllers again, but this is what `factory.js` should look like:

```
app.factory('AbstractResource', [

  function () {
    function AbstractResource(restangular, route) {
      this.restangular = restangular;
      this.route = route;
    }

    AbstractResource.prototype = {
      getList: function (params) {
        return this.restangular.all(this.route).getList(params).$object;
      },
      get: function (id) {
        return this.restangular.one(this.route, id).get();
      },
      update : function(object){
        return this.restangular.all(this.route + "/" + object._id).post(object);
      },
      create: function (newResource) {
        return this.restangular.all(this.route + "/create").post(newResource);
      },
      remove: function (object) {
        return this.restangular.one(this.route + "/" + object._id).remove();
      }
    };

    AbstractResource.extend = function (repository) {
      repository.prototype = Object.create(AbstractResource.prototype);
      repository.prototype.constructor = repository;
    };

    return AbstractResource;
  }
]);
```

### Back to controllers

We've already got the controllers set up, and now we're going to use the routes we created in `factory.js` in the controllers so that we can dynamically manipulate the DOM with our controller logic, hit routes from the client site using Restangular, reach the server, and do our CRUD actions. Let's get started. 

The first thing we'll have to do is define the resource taht interfaces with Restangular. This resource will then get injected into our controller, so that we can use it. Thankfully, we've created an `AbstractResource` so all we need to do is instantiate a `MessageResource`. Create it, and inject it (as well as Restangular) into the controller: 

	app.controller('MainCtrl', function($scope, Restangular, MessageResource){
		$scope.myMessage = "You're not entitled to an answer, HAL";
	});

Great - when we refresh the page we should see no errors. Now, let's hit our first route using Restangular

### Index/getList

This will replace our index route that we defined in Express in the previous tutorial. It will serve the same function, but this way we can set whatever comes back from the server on $scope. In the controller, define the following: 
	
	// GET all messages
	$scope.messages = MessageResource.getList();

Now, we've done a GET request, if you trace through the `AbstractResource`, you'll see that we hit the route `/messages`, which invokes the `indexMessages` function on our server side `odyssey.controller.js`

This is where it starts to get really fun: We can now start replacing all those places where we've been using express to hit routes with Restangular, set them on $scope, and use them however we like on the client side! Let's change `disconnect.jade` to reflect this: 

@TODO: Introduce ng-repeat and ng-href here 

	extend ./layout
	block content
		h1= title
		img(src='http://bit.ly/VqvT6b', width='100', height='100')
		p HAL: What do you think you are doing dave
		p Dave: {{myMessage}}
		h2 Messages
		div(ng-repeat='message in messages')
			a(ng-href='/messages/{{message._id}}') {{message.content}}
		form(name="", method="post", action="/messages/create")
			input(type="text", placeholder="New message", name="content")
			button(type="submit") Create New Message


### Create/Post

Next, let's do the same thing with the POST action, and angularize our form. We'll replace the form we have now with an angularized form. It will server the same purpose - POST to our data base - but different architecture

@TODO: Explain what's going on in the code

Instead of submitting a form, we're going to create an angular controller function that will be invoked, passing in a variable on $scope to the server. We'll see this paradigm throughout the rest of the tutorial, it allows us to be more flexible in our implementation. 

* Controller : Create POST controller action
	* This creates route 
	* This his correct server controller action 
* View : Bind ng-model to myMessage on the input field 

Next, in the controller do the following:
1. create the post action, so that we can post new responses 
2. set `$scope.myMessage = {content: ""};` that way we can see it change in real time as we enter our input<br>
	
```
$scope.myMessage = {content:""};

// POST 
$scope.createMessage = function(){
	MessageResource.create($scope.myMessage).then(function(){
    // refreshes the list 
    $scope.messages = MessageResource.getList();
    // reset current myMessage
    $scope.myMessage = {content:""};
	});
};

```

And on our view, bind ng-model - the view should look like this: 

```
extend ./layout
block content
	.row
		.col-md-8.col-md-offset-2
			h1= title
			img(src='http://bit.ly/VqvT6b', width='100', height='100')
			p HAL: What do you think you are doing dave
			p Dave: {{myMessage.content}}
			h2 Messages
			div.messages-list
				div(ng-repeat='message in messages')
					a(ng-href='/messages/{{message._id}}') {{message.content}}
			form(method="post")
				input.form-control(type="text" ng-model="myMessage.content")
				button.btn.btn-primary.btn-md(ng-click="createMessage()") Create New Message 

// POST 
$scope.createResponse = function(){
	Restangular.all('create-response').post({
		content : $scope.myResponse.content
	});
};

```
### Quick aside: STYLING

@TODO: Introduce bootstrap - let's make this thing nicer
@TODO: Introduce CSS - should be introduced way earlier

/lib/styles/main.css 

<br><br>

## PART 4: Angular UI Router

### Last parts Angular UI: Get One, Update, Delete 

### SHOW

We're going to introduce templating here. In our express example, we routed to a separate show page. Every time we load a page, it is going to the server, and doing a `res.render()`. Let's change this by using ui-router. We'll transfer everything on message.jade in this template
@TODO: Explain why we would do this, I'm going to write up the tutorial first then come back to this

"ui router is a routing framework which allows you to organize parts of your interface into a state machine"

* Angular ui router docs here https://github.com/angular-ui/ui-router
* bower install angular-ui-router
* add ui-router to angular.module


### ui-vew explanation
We're going to do a POC 
@TODO: Need to go in depth as to what is going on in each of these steps, in the meantime these are the steps I took:

1. Config : app.config in controller. Let's do a text with a simple template
2. ui-view : place ui-view where you'd want it to render
3. ui-sref : links to the state, not route

Code for the steps: 

1 . Config in controller.js
	* Explain what's going on here

```
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
    			template : '<h1> I AM A TEMPLATE </h1>'
    		}
    	}
    });
  }
]);
```
<br>	

2 . in disconnect.jade at the end of everything 

```
.row
	.col-md-8.col-md-offset-2(ui-view='')
```


3 . ui-sref, link to the state not route
```
a(ui-sref='messages.item({id:message._id})') {{message.content}}
```



### Grab data 
Great, now that we have that hooked up, we can focus on getting the data for each record. We're going to do this by hitting the route with an angular controller action, similarly to how we did for index/getList. 

1 . Change server side controller action - we just want the doc sent back, no rendering of views
```
showMessage : function(req, res){
	var messageId = req.params.id;
	Message.findById(messageId, function(err, doc){
    res.json(doc);
	});
}
```

2 . Define action in client controller
```
// GET one
$scope.getMessage = function(id){
	$scope.message = MessageResource.get(id).then(function(data){
		$scope.currentResponse = data;
		console.log($scope.currentResponse)
	});
}
```

3 . Invoke on the view
```
a(ui-sref='messages.item({id:message._id})' ng-click='getMessage(message._id)') {{message.content}}
```

Now, if we look in our browser console, we'll see that the message object is logged


### Creating the template
@TODO: Go more indepth about this
UI templating - cant use jade. Create a new HTML template, add it to our UI routing

1 . Create new template, main.html
```
<h1> This is the document </h1>
<p> Document Title : {{currentResponse.content}}</p>
```
2 . Change templateUrl in state, this will now grab that template
```
.state('messages.item', {
	url: '/{id}',
	views : {
		'@' : {
			templateUrl : 'views/message.html'
		}
	}
});
```
3 . modify showMessage to send over res.json not res.render


4 . uisref + getMessage on view --> routes --> grab record from db --> set to $scope.currentMessage, now available to manipulate on client

### UPDATE

Great! Now that we have the record available to us on our client side, Updating and Delete will be straight forward

1 . Create Update controller
	* Add $location to the overall MainCtrl cause we're going to use it to redirect

```
// UPDATE Document 
$scope.updateMessage = function(){
  MessageResource.update($scope.currentMessage).then(function(data){
    $scope.messages = MessageResource.getList();
    $location.path('/');
  });
}
```

2 . Add the form to our HTML template

```
<div class='message-partial'>
	<h2> Edit Message </h2>
	<p> Document Title : {{currentMessage.content}}</p>
	<form>
		<input class='form-control' type='text' placeholder='Updated message here' ng-model="currentMessage.content"/>
		<button class="btn btn-default pull-left" ng-click="updateMessage()"> Update Message </button>
</div>
````

### DELETE

Delete will be pretty much identical to Update

1. Create Delete controller

```
// DELETE
$scope.deleteMessage = function(){
  if(window.confirm('Are you sure?')){
    MessageResource.remove($scope.currentMessage).then(function(){
      $scope.messages = MessageResource.getList();
      $location.path('/');
    });
  }
}
```

2. Modify server destroyMessage controller, we don't want to redirect to the view

```
Message.remove({_id: messageId}, function(err){
  res.json();
});
```

2. Add the button that invokes to our HTML template

```
<button class="btn btn-default btn-danger" ng-click="deleteMessage()"> Delete Message </button>
```

### Page redirects, hide partials, overall styling clean up 
After delete and update, I want the message-partial to be hidden. Also added styling

-----
Congrats! That's the end of the tutorial
-----