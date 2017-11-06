efasApp.controller("homeController",["$scope", "$log", "$http", "d3Service", function($scope, $log, $http, d3Service){

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
			method: 'GET',
			url: '/report',
			data: $scope.selectedFilters
		}).then(function(response) {

			$log.log(response);

			d3Service.createChart("horizontal-bar", {
	    		data: [
		            {"error_name": "error 1", "check_ins": 23.5},
		            {"error_name": "error 2", "check_ins": 24.5},
		            {"error_name": "error 3", "check_ins": 25.5},
		            {"error_name": "error 4", "check_ins": 26.5},
		            {"error_name": "error 5", "check_ins": 27.5},
		            {"error_name": "error 6", "check_ins": 12.5},
		            {"error_name": "error 7", "check_ins": 28.5},
		            {"error_name": "error 8", "check_ins": 24.5},
		            {"error_name": "error 9", "check_ins": 22.5},
		            {"error_name": "error 10", "check_ins": 23.5},
		            {"error_name": "error 11", "check_ins": 23.5},
		            {"error_name": "error 12", "check_ins": 21.5},
		            {"error_name": "error 13", "check_ins": 23.5},
		            {"error_name": "error 14", "check_ins": 22.5},
		            {"error_name": "error 15", "check_ins": 23.5},
		            {"error_name": "error 16", "check_ins": 24.5},
		            {"error_name": "error 17", "check_ins": 13.5},
		            {"error_name": "error 18", "check_ins": 13.5},
		            {"error_name": "error 19", "check_ins": 22.5},
		            {"error_name": "error 20", "check_ins": 33.5}
	            ],
	            title: "Top 20 FSP Entries per 1000 KM",
	            category_field: "error_name",
	            value_field: "check_ins",
	            draw_height: 1

	    	}, "chart1");

			d3Service.createChart("pie", {
	    		data: [
	    			{
	                    "SE_Date": "11-01",
	                        "count": 156.9
	                }, {
	                    "SE_Date": "03-02",
	                        "count": 131.1
	                }, {
	                    "SE_Date": "29-13",
	                        "count": 115.8
	                }, {
	                    "SE_Date": "13-04",
	                        "count": 109.9
	                }, {
	                    "SE_Date": "09-05",
	                        "count": 108.3
	                }, {
	                    "SE_Date": "21-06",
	                        "count": 65
	                }, {
	                    "SE_Date": "17-07",
	                        "count": 50
	                }
	            ],
	            title_field: "SE_Date",
	            value_field: "count",
	            draw_height: 0.5

	    	}, "chart2");

			d3Service.createChart("horizontal-bar", data = {
	    		data: [
		            {"error_name": "error 1", "check_ins": 23.5},
		            {"error_name": "error 2", "check_ins": 24.5},
		            {"error_name": "error 3", "check_ins": 25.5},
		            {"error_name": "error 4", "check_ins": 26.5},
		            {"error_name": "error 5", "check_ins": 27.5},
		            {"error_name": "error 6", "check_ins": 12.5},
		            {"error_name": "error 7", "check_ins": 28.5},
		            {"error_name": "error 8", "check_ins": 24.5},
		            {"error_name": "error 9", "check_ins": 22.5},
		            {"error_name": "error 10", "check_ins": 23.5}
	            ],
	            title: "Top 20 FSP Entries per 1000 KM",
	            category_field: "error_name",
	            value_field: "check_ins",
	            draw_height: 0.5

	    	}, "chart3");

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
			$scope.filters = {
				"SGBD-KIEFA": ["EA", "EF"],
				"SGBD": ["foo1", "foo2"],
				"Serie": ["foo1", "foo2"],
				"VIN": ["foo1", "foo2"],
				"FSP Hex Code": ["foo1", "foo2"],
				"I Step": ["foo1", "foo2"],
				"Building Phase": ["foo1", "foo2"],
				"DTC Incident": ["foo1", "foo2"],
				"IS DTC": ["foo1", "foo2"],
				"CheckIn Flag": ["foo1", "foo2"],
				"E/E Priority": ["foo1", "foo2"]
			}
		}).then(function(error){
			$log.log("error: " + error);
		});
    }

    $scope.getFilters();
    $scope.getReport();

}]);