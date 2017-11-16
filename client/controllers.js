efasApp.controller("homeController",["$scope", "$log", "$http", "charts", function($scope, $log, $http, charts){

    $scope.filters = {};
    $scope.selectedFilters ={};

    $scope.today = new Date();
    $scope.dateFilterOptions = {"Day": 0, "Week": 7, "Month": 30, "Quarter": 90, "Year": 365, "Total": -1};

    $scope.count_vehicles = 0;
    $scope.count_checkins = 0;
    // $scope.isFilterChanged = false;
    $log.log("requesting /overview, filters: " + $scope.filters);

    $scope.toggleLeftPanel = function(){
    	console.log($("#left-panel").css("left"));
    	if(parseInt($("#left-panel").css("left"))<0){
    		$("#left-panel").css({"left": "0px"});
    		$(".main-holder").css({"left": ($("#filters-container").width() + 3) + "px"});
    		$("#cover").css({"visibility": "visible"});
    		$("#show-filters-button div").html("APPLY");
    	}
    	else{
    		//$("#left-panel").css({"left": "-" + ((300 - $("#show-filters-button").width())  
    		//	+ parseInt($("#show-filters-button").css("margin"))) + "px" });
    		$("#left-panel").css({"left": "-" + ($("#filters-container").width() + 3) + "px" });
    		$(".main-holder").css({"left": "0"});
    		$("#show-filters-button div").html("FILTERS");
    		$("#loader").css({"visibility": "visible"});
    		setTimeout(function () {
			  	$scope.getReport();
			}, 1000);
    		
    	}
    }

    $scope.toggleTopPanel = function(){
    	console.log($("#top-panel").css("top"));
    	if(parseInt($("#top-panel").css("top"))<0){
    		$("#top-panel").css({"top": "0px"});
    		$(".main-holder").css({"top": ($("#timeline-filter-container").height()) + "px"});
    		$("#cover").css({"visibility": "visible"});
    		$("#show-timeline-filter-button div").html("APPLY");
    	}
    	else{
    		//$("#left-panel").css({"left": "-" + ((300 - $("#show-filters-button").width())  
    		//	+ parseInt($("#show-filters-button").css("margin"))) + "px" });
    		$("#top-panel").css({"top": "-" + ($("#timeline-filter-container").height()) + "px" });
    		$(".main-holder").css({"top": "0"});
    		$("#show-timeline-filter-button div").html("Choose Date and Time");
    		$("#loader").css({"visibility": "visible"});
    		setTimeout(function () {
			  	$scope.getReport();
			}, 1000);
    		
    	}
    }

    $scope.handleDateOption = function(filter){
    	if(filter === "Total"){
    		$scope.selectedFilters["Date"] = [];
    		// $scope.getReport();
    		return;
    	}
    	var days = $scope.dateFilterOptions[filter];
    	$scope.selectedFilters["Date"] = [(new Date($scope.today - (days * 24* 60 * 60 * 1000))).getFullYear() + "-" 
    		+ ((new Date($scope.today - (days * 24* 60 * 60 * 1000))).getMonth() + 1) + "-" 
    		+ (new Date($scope.today - (days * 24* 60 * 60 * 1000))).getDate(),
    		$scope.today.getFullYear() + "-" + ($scope.today.getMonth() + 1) + "-" + $scope.today.getDate(),
    		];

    	// $scope.getReport();
    }

    $scope.dateOptionSelected = function(elt, event){
    	$scope.handleDateOption(elt.filter);
    	$(event.currentTarget).siblings().css({"background-color": "white", "color": "#3498db", "border-bottom": "none"});
    	$(event.currentTarget).css({"color": "#C2185B", "border-bottom": "3px solid #C2185B"});
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

  		$("#cover").css({"visibility": "visible"});
		$("#loader").css({"visibility": "visible"});
    	 $http({
			method: 'POST',
			url: '/report',
			data: {filters: $scope.selectedFilters}
		}).then(function(response) {

			$log.log("report response", response);

			$scope.count_checkins = response.data.results.chart5[0].count_checkins;
			$scope.count_vehicles = response.data.results.chart5[0].count_vehicles;

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
	    	$("#cover").css({"visibility": "hidden"});
			$("#loader").css({"visibility": "hidden"});
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

    

    // $scope.$watch("selectedFilters['Hours']", function(newValue, oldValue){
    // 	console.log("Hours changed");
    // });

     $( function() {
	    $( "#slider-range" ).slider({
	      range: true,
	      min: 0,
	      max: 24,
	      values: [ 0, 24 ],
	      slide: function( event, ui ) {
	        $( "#hour-range" ).val( ui.values[ 0 ] + " to " + ui.values[ 1 ] );
	        $scope.selectedFilters["Hour"] = ui.values;
	        // setTimeout(function(){
	        // 	$scope.getReport();
	        // },750);
	      }
	    });
	    $( "#hour-range" ).val( $( "#slider-range" ).slider( "values", 0 ) +
	      " to " + $( "#slider-range" ).slider( "values", 1 ) );
	  } );


     $scope.setupLayout = function(){
     	$("#top-panel").css({"top": "-" + ( $("#timeline-filter-container").height() + 20) + "px" });
     	$("#left-panel").css({"left": "-" + ($("#filters-container").width() + 10) + "px" });
     	setTimeout(function(){
		    $("#cover").css({"visibility": "hidden", "z-index": "50" });
		 	$("#loader").css({"visibility": "hidden", "z-index": "50" });
	 	}, 1000);
     	
     }

     $scope.setupLayout();
     
     // setTimeout(function(){
     	$scope.getFilters();
		$scope.getReport();
     // }, 10000);
	

}]);