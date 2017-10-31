efasApp.controller("homeController",["$scope", "$log", "$http", "d3Service", function($scope, $log, $http, d3Service){

    $scope.filters = {};
    $log.log("requesting /overview, filters: " + $scope.filters);

    $http({
	  method: 'GET',
	  url: '/report'
	}).then(function(reponse) {
		$log.log(reponse);
		d3Service.createChart("horizontal-bar", {}, "#chart1");
		d3Service.createChart("pie", {}, "#chart2");
	}, function(error) {
		$log.log("error: " + error);
	});

}]);