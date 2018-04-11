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

.service('GroceryService', function(){
	var groceryService = {};

	// grocery list
	groceryService.groceryItems = [
		{id: 1, completed: true, itemName: 'milk', date: '2014-10-00'},
		{id: 2, completed: true, itemName: 'cookies', date: '2014-10-01'},
		{id: 3, completed: true, itemName: 'ice cream', date: '2014-10-02'},
		{id: 4, completed: true, itemName: 'potatoes', date: '2014-10-02'},
		{id: 5, completed: true, itemName: 'cereal', date: '2014-10-03'},
		{id: 6, completed: true, itemName: 'bread', date: '2014-10-03'},
		{id: 7, completed: true, itemName: 'eggs', date: '2014-10-04'},
		{id: 8, completed: true, itemName: 'tortillas', date: '2014-10-04'}
	]

	/* Pull the information to the next page
	 */
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
	.*
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
			entry.id = groceryService.getNewId();
			groceryService.groceryItems.push(entry);
		}

	};

	return groceryService;
})

.controller('HomeController', ["$scope", 'GroceryService', function($scope, GroceryService) {
	$scope.appTitle = 'Grocery List';

	// I get the grocery items from the servicce
	$scope.groceryItems = GroceryService.groceryItems;
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

}]);
