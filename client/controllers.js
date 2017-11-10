efasApp.controller("homeController",["$scope", "$log", "$http", "charts", function($scope, $log, $http, charts){

    $scope.filters = {};
    $scope.selectedFilters ={}
    // $scope.isFilterChanged = false;
    $log.log("requesting /overview, filters: " + $scope.filters);

    $scope.toggleSidePane = function(toggleButton){
    	console.log(toggleButton.$parent);
    	toggleButton.$parent.css({"background-color": "green"});
    }

    $scope.filterChanged = function(elt, event){

    	if(event.target.checked){
    		if(!$scope.selectedFilters[elt.$parent.filter_name])
    			$scope.selectedFilters[elt.$parent.filter_name] = [];
			$scope.selectedFilters[elt.$parent.filter_name].push(elt.item);
			$log.log($scope.selectedFilters);
			// $scope.isFilterChanged = true;
    	}
    	else {
    		if($scope.selectedFilters[elt.$parent.filter_name]){
				let i = $scope.selectedFilters[elt.$parent.filter_name].indexOf(elt.item);
				$scope.selectedFilters[elt.$parent.filter_name].splice(i,1);
    		}
			$log.log($scope.selectedFilters);

			// for(let key in $scope.selectedFilters){
			// 	if(! $scope.selectedFilters[key].length == 0){
			// 		$scope.isFilterChanged = true;
			// 		break;
			// 	}
			// }
    	}

    }

    $scope.getReport = function(){
    	 $http({
			method: 'POST',
			url: '/report',
			data: {filters: $scope.selectedFilters}
		}).then(function(response) {

			$log.log("report response", response);

	  		charts.createChart("horizontal-bar", {
	    		data: response.data.results.chart1,
	            title: response.data.titles.chart1,
	            category_field: response.data.category_fields.chart1,
	            value_field: response.data.value_fields.chart1,
	            draw_height: .9
	    	}, "chart1");

			charts.createChart("pie", {
	    		data: response.data.results.chart2,
	    		title: response.data.titles.chart2,
	            title_field: response.data.category_fields.chart2,
	            value_field: response.data.value_fields.chart2,
	            draw_height: 0.6
	    	}, "chart2");

			charts.createChart("horizontal-bar", {
	    		data: response.data.results.chart3,
	            title: response.data.titles.chart3,
	            category_field: response.data.category_fields.chart3,
	            value_field: response.data.value_fields.chart3,
	            draw_height: 0.6
	    	}, "chart3");

	    	charts.createChart("horizontal-bar", {
	    		data: response.data.results.chart4,
	            title: response.data.titles.chart4,
	            category_field: response.data.category_fields.chart4,
	            value_field: response.data.value_fields.chart4,
	            draw_height: .9
	    	}, "chart4");

		}, function(error) {
			$log.log("error: " + error);
		});
    }

    //load filters
    $scope.getFilters = function(){
    	$http({
			method: 'GET',
			url: '/filters'
		}).then(function(response) {
			console.log("filters' response", response);
			// $scope.filters = {
			// 	"SGBD-KIEFA": ["EA", "EF"],
			// 	"SGBD": ["foo1", "foo2"],
			// 	"Serie": ["foo1", "foo2"],
			// 	"VIN": ["foo1", "foo2"],
			// 	"FSP Hex Code": ["foo1", "foo2"],
			// 	"I Step": ["foo1", "foo2"],
			// 	"Building Phase": ["foo1", "foo2"],
			// 	"DTC Incident": ["foo1", "foo2"],
			// 	"IS DTC": ["foo1", "foo2"],
			// 	"CheckIn Flag": ["foo1", "foo2"],
			// 	"E/E Priority": ["foo1", "foo2"]
			// }
			$scope.filters = response.data.filters;
		}).then(function(error){
			$log.log("error: " + error);
		});
    }

    $scope.getFilters();
    $scope.getReport();

}]);