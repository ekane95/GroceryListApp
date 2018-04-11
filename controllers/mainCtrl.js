angular.module('mainCtrlModule', [])

.controller('mainCtrl', ['$scope', 'Calculations', function($scope, Calculations){
	//our programming work is done

	$scope.tutorialObject = {};
	$scope.tutorialObject.firstname = "Endrit";
	$scope.tutorialObject.lastname = "kane";
	$scope.tutorialObject.title = "Main Page";
	$scope.tutorialObject.subtitle = "Sub Title";
	$scope.tutorialObject.number = 2;
	$scope.tutorialObject.bindOutput = 2;

	$scope.timesTwo = function () {
		$scope.tutorialObject.bindOutput = Calculations.timesTwo($scope.tutorialObject.bindOutput);
	};

	Calculations.pythagorianTheorum();

}])

.controller('secondCtrl', ['$scope', function($scope){
	//our programming work is done
	$scope.secondTutorial = "This is the second Page";
}])


.directive('ekWelcomeMessage', function(){
	// Runs during compile
	return {
		// name: '',
		// priority: 1,
		// terminal: true,
		// scope: {}, // {} = isolate, true = child, false/undefined = no change
		// controller: function($scope, $element, $attrs, $transclude) {},
		// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
		restrict: 'AE', // E = Element, A = Attribute, C = Class, M = Comment
		template: '<div> Howdy, howww are you? I am an Attribute and Element directive </div>',
		// templateUrl: '',
		// replace: true,
		// transclude: true,
		// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
		link: function($scope, iElm, iAttrs, controller) {
			
		}
	};
})

.factory('Calculations', function(){
	var calculations = {};

	calculations.timesTwo = function(a) {
		return a * 2;
	};

	calculations.pythagorianTheorum = function(a, b) {
		return (a * a) + (b * b);
	};

	return calculations;
});