efasApp.service("d3Service", function(){
    
	var container_space = $(window).innerHeight() * .85

	var drawMyHorizontal = function(data, holder){
		var data = {
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

    	};
    	var holder = "container";
		var chart_div = $("#" + holder);
		var num_categories = data.data.length;
		var value_min = function(){
			var min = Number.MAX_SAFE_INTEGER;
			for(var di in data.data){
				if(min > data.data[di][data.value_field])
					min = data.data[di][data.value_field];
			}
			return min;
		}();
		var value_max = function(){
			var max = Number.MIN_SAFE_INTEGER;
			for(var di in data.data){
				if(max < data.data[di][data.value_field])
					max = data.data[di][data.value_field];
			}
			return max;
		}();
		var value_step_px =  chart_div.width() / (value_max - value_min);

		chart_div.append("<div class='row'> \
				<div id='category-holder' class='col-xs-6 axis-section-horizontal'></div> \
				<div id='value-holder' class='col-xs-6 axis-section-horizontal'></div> \
			</div");
		for(var di in data.data){
			$("#category-holder").append(
				"<div class='col-md-12 category item'>" + data.data[di][data.category_field] + 
				"<div class='indicator'>-</div>" + 
				"</div>"
			);
			$("#value-holder").append(
				"<div class='col-md-12 category item'>" + data.data[di][data.value_field] + "</div>"
			);
		}
		
	}

    var drawPie = function(data, holder){

    	$("#" + holder).height(container_space * data.draw_height + "px");
    	AmCharts.makeChart(holder, {
            "type": "pie",
            "theme": "light",
            "titles": [
				{
					"text": data.title,
					"size": 12
				}
			],
            "labelsEnabled": false,
            "dataProvider": data.data.sort(function(a,b){return a[data.value_field] > b[data.value_field] ? -1 : 1;}),
            "titleField": data.title_field,
            "valueField": data.value_field,
            "balloonText": "[[title]]<br><span style='font-size:14px'><b>[[value]]</b> ([[percents]]%)</span>",
            "legend": {
            	"position": "right",
            	"fontSize":"9em",
                "align": "center",
                "markerType": "circle"
            },
       		creditsPosition:"bottom-right"
        });

    }

    var drawHorizontalBar = function(data, holder){

    	$("#" + holder).height(container_space * data.draw_height + "px");
    	AmCharts.makeChart(holder, {

            type: "serial",
            theme: "light",
            dataProvider: data.data.sort(function(a,b){return a[data.value_field] > b[data.value_field] ? -1 : 1;}),
            categoryField: data.category_field,
            startDuration: 1,
            rotate: true,
            startEffect: "bounce",

            categoryAxis: {
                gridPosition: "start"
            },
            valueAxes: [{
                position: "top",
                title: data.title,
                minorGridEnabled: true
            }],
            graphs: [{
                type: "column",
                title: data.value_field,
                valueField: data.value_field,
                fillAlphas:1,
                balloonText: "<span style='font-size:13px;'>[[title]] in [[category]]:<b>[[value]]</b></span>"
            }],
            legend: {
                useGraphSettings: true
            },
            creditsPosition:"bottom-right"
        });

    }

    var mapCharts = {
    	"horizontal-bar": drawHorizontalBar,
    	"pie": drawPie
    }

    this.createChart = function(type, data, holder){
    	mapCharts[type](data, holder);
    }
    
});