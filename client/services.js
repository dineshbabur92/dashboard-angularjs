efasApp.service("d3Service", function(){
    
	var container_space = $(window).innerHeight() * .85

    var drawPie = function(data, holder){

    	$("#" + holder).height(container_space * data.draw_height + "px");
    	AmCharts.makeChart(holder, {
            "type": "pie",
            "theme": "light",
            "titles": [
				{
					"text": "Actual I-Step Distribution(KW 40)",
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

    	// console.log("creating chart...");
    	$("#" + holder).height(container_space * data.draw_height + "px");
    	AmCharts.makeChart(holder, {

            type: "serial",
            theme: "light",
            dataProvider: data.data.sort(function(a,b){return a[data.value_field] > b[data.value_field] ? -1 : 1;}),
            categoryField: data.category_field,
            startDuration: 1,
            rotate: true,

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