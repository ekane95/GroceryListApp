var app = angular.module('groceryListApp', ["ngRoute"])

.config(function($routeProvider, $locationProvider) {
	$locationProvider.hashPrefix('!');
	$routeProvider

	.when("/", {
		templateUrl: "views/groceryList.html",
		controller: "HomeController"
	})

	.when("/addItem", {
		templateUrl: "views/addItem.html",
		controller: "GroceryListItemController"
	})

	.when("/addItem/edit/:id", {
		templateUrl: "views/addItem.html",
		controller: "GroceryListItemController"
	})


	.otherwise({
		redirectTo: "/"
	});
})

.service('GroceryService', function($http){
	var groceryService = {};

	// grocery list
	groceryService.groceryItems = [];

	$http.get("data/server_data.json")
		.success(function(data){
			groceryService.groceryItems = data;

			for(var item in groceryService.groceryItems){
				groceryService.groceryItems[item].date = new Date(groceryService.groceryItems[item].date);
			}
		})
		.error(function(data,status){
			alert("Things went wrong!");
		});

	/* Pull the information to the next page */
	groceryService.findById = function (id) {
		for ( var item in groceryService.groceryItems ) {
			if ( groceryService.groceryItems[item].id === id ) 
				return groceryService.groceryItems[item];
		}
	}

	/* I generate unique ID for every new item we add to the list
		normally we don't have to do this because the server takes care of this,
		but this app is offline so I have to do it.

		We want this unique ID for later use when we will edit or delete items.

		First I check if I have an item name newId, I increase that newId by one, then return it
		Otherwise I create it, using underscore.js library.
		I find the max ID from grocery list and return it
		Once It return entry.id I add that id + 1 to the newId and return it
	*/
	groceryService.getNewId = function() {
		if ( groceryService.newId ) {
			groceryService.newId++;
			return groceryService.newId;
		} else {
			var maxId = _.max(groceryService.groceryItems, function(entry) { return entry.id;});
			groceryService.newId = maxId.id + 1;
			return groceryService.newId;
		}
	};

	/*
	 * this function is called every time we add a new item 
	 * it get the highest entry id from the getNewId function
	 * and then push this new item on the grocery items list

	 * look for the item on the list
	 * if I find it, that means I am editing an entry 
	 * and I need to update it attributes 
	 * otherwise I don't find a new entry so I create a new one
	 */
	groceryService.save = function(entry) {
		var updatedItem = groceryService.findById(entry.id);
		if ( updatedItem ) {
			updatedItem.completed = entry.completed;
			updatedItem.itemName = entry.itemName;
			updatedItem.date = entry.date;
		} else {
			$http.post('data/added_item.json', entry)
			.success(function(data){
				entry.id = data.newId;
			})
			.error(function(data,status) {
				
			});

			// entry.id = groceryService.getNewId();
			groceryService.groceryItems.push(entry);
		}
	};

	/* Remove item by getting the index of the item clicked */
	groceryService.removeItem = function(entry) {
		var index = groceryService.groceryItems.indexOf(entry);

		/* 
		 * 1st parameter use the index to start,
		 * 2nd parameter tells how many items do you want to delete starting from the index
		 */
		groceryService.groceryItems.splice(index, 1);
	};

	groceryService.markCompleted = function(entry) {
		entry.completed = !entry.completed;
	}

	return groceryService;
})

.controller('HomeController', ["$scope", 'GroceryService', function($scope, GroceryService) {
	$scope.appTitle = 'Grocery List';

	/* Get the grocery items from the servicce */
	$scope.groceryItems = GroceryService.groceryItems;

	/* Remove the item from the list using the function in the service */
	$scope.removeItem = function (entry) {
		GroceryService.removeItem(entry);
	}

	$scope.markCompleted = function (entry) {
		GroceryService.markCompleted(entry);
	}

	$scope.markCompleted = function (entry) {
		GroceryService.markCompleted(entry);
	}

	$scope.$watch( function () { return GroceryService.groceryItems; }, function (groceryItems) {
		$scope.groceryItems = groceryItems;
	});

}])

.controller('GroceryListItemController', ["$scope", '$routeParams', '$location', 'GroceryService', function($scope, $routeParams, $location, GroceryService) {

	if ( !$routeParams.id ) {
		$scope.groceryItem = { id:0, completed:false, itemName: "", date: new Date() }
	} else {
		$scope.groceryItem = _.clone(GroceryService.findById( parseInt( $routeParams.id ) ) );
	}

	// on save I call the GroceryService.save function
	// then we go to the main page
	$scope.save = function(){
		GroceryService.save( $scope.groceryItem );
		$location.path("/");
	}

}])

.directive('ekGroceryItem', function() {
	return {
		restrict: 'E',
		templateUrl: 'views/groceryItem.html'
	}
});
