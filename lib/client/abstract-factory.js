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
