efasApp.service("charts", function($rootScope){
    
    this.filters = {};
    var filters = this.filters;
    
	this.getFilters = function(){return filters;}

	var container_space = $(window).innerHeight() * .90
	
	var drawPie = function(data, holder){

    	$("#" + holder).height(container_space * data.draw_height + "px");

    	var input_data = [];
    	for(var i in data.data){
    		input_data.push({name: data.data[i][data.title_field], y: data.data[i][data.value_field]});
    	}
    	console.log(data);

        Highcharts.chart(holder, {
	    chart: {
	        plotBackgroundColor: null,
	        plotBorderWidth: null,
			backgroundColor: '#f0f3f4',
	        plotShadow: false,
	        type: 'pie',
			style: {
				fontFamily: 'Source Sans Pro'
			}
	    },
	    title: {
			text: data.title,
			align: 'left',
			style: {
				"color":"#666",
				"font-weight":'bold'
			},
			x: 0
		},
	    tooltip: {
	        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b><br/>' + data.selectedFilters
	    },
		colors: [
			"#004F74", "#0072A7", "#0092D6", "#008AE6", "#48C9B0", "#A3E2FF", "#A3E4D7", "#A3E4D7", "#E8F8F5"
		],
		exporting: {
			enabled: false
		},
	    plotOptions: {
	        pie: {
		            allowPointSelect: true,
		            cursor: 'pointer',
		            dataLabels: {
		                enabled: true,
		                format: '<b>{point.name}</b>: {point.percentage:.1f} %',
		                style: {
		                    color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
		                }
		            },
		            dataLabels: {
		                enabled: false
		            },
		            showInLegend: true,
		            events:{
		            	click: function(e){
		            		filters[data.title_field] = e.point.name;
		            		$rootScope.$apply();
		            	}
		            }
		        }  
	    },
	    series: [{
	        name: 'Brands',
	        colorByPoint: true,
	        data: input_data
	    }],
	    legend: {
	        layout: 'vertical',
	        align: "left",
	        verticalAlign: "top",
	        x: 0,
	        y: 50,
	        floating: true,
	        borderWidth: .5,
	        backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
	        shadow: false,
	        style:{
	        	border: 0
	        }
	    },
	});

    }

    var drawHorizontalBar = function(data, holder){


    	$("#" + holder).height(container_space * data.draw_height + "px");

		var labels = [];
		var values = [];
		for(var i in data.data){
			labels.push(data.data[i][data.category_field]);
			values.push(data.data[i][data.value_field]);
		}
		values = values.sort(function(a,b){return a>b?-1:1});


    	if(holder === "chart4"){
    		console.log("chart4 values length: " + values.length);
    		$("#" + holder).css({"overflow-x": "hidden", "overflow-y": "auto", "height": values.length*25});
    	}

		Highcharts.chart(holder, {
		    chart: {
		        type: 'bar',
				backgroundColor: '#f0f3f4',
				style: {
					fontFamily: 'Source Sans Pro'
				}
		    },
			title: {
				text: data.title,
				align: 'left',
				style: {
					"font-weight":'bold',
					"color": '#666'
				},
				x: 0
			},
			legend: {
				enabled: false
			},
		    xAxis: {
		        categories: labels,
		        title: {
		            text: null
		        },
		        labels: {
		        	style: {
		                width: holder === "chart4" ? (($("#"+holder).width() *.75) + "px") : undefined,
		                'min-width': '100px',
		                'text-overflow': 'hidden'
		            },
		            useHTML : true
		        },
		        // scrollbar: {
		        //     enabled: true
		        // },
		        // width: holder === "chart4" ? (($("#"+holder).width() *.05) + "px") : undefined,
		    },
			exporting: {
				enabled: false
			},
		    yAxis: {
		        min: 0,
		        tickInterval: holder === "chart4" ? 1 : undefined,
		        width: holder === "chart4" ? (($("#"+holder).width() *.05) + "px") : undefined,
		        title: {
		            text: data.value_field,
		            align: 'high'
		        },
		        labels: {
		            overflow: 'justify'
		        }
		    },
		    tooltip: {
		        valueSuffix: '',
		        positioner: function(labelWidth, labelHeight, point) {
			        // var tooltipX = holder === "chart4" ? point.plotX + 400 : point.plotX;
			        var tooltipX = ($("#" + holder).width()  * 0.1);
			        var tooltipY = point.plotY;
			        return {
			            x: tooltipX,
			            y: tooltipY
			        };
			    },
			    pointFormat: '{series.name}: <b>{point.y}</b><br/>' + data.selectedFilters,
			    // useHTML: true,
			    // "style":{
			    // 	"padding": "0"
			    // },
			    borderWidth: 0,
			    backgroundColor: "rgba(255,255,255,1)",
			    borderRadius: 0,
			    shadow: true,
			    useHTML: true,
			    percentageDecimals: 2,
			    padding: 0,
			    backgroundColor: "rgba(255,255,255,1)"
		    },
		    plotOptions: {
		        bar: {
		            dataLabels: {
		                enabled: true
		            },
		            events:{
		            	click: function(e){
		            		console.log("selected:", e.point.category);
		            		filters[data.category_field] = e.point.category;
		            		console.log("Filters on click: ", filters);
		            		$rootScope.$apply();
		            	}
		            }
		        }
		    },
		    // tooltip: {
		    //     pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
		    // },
			
		    /*legend: {
		        layout: 'vertical',
		        align: holder == "chart4" ? "left" : "right",
		        verticalAlign: holder == "chart4" ? "top" : "bottom",
		        x: 0,
		        y: -50,
		        floating: true,
		        borderWidth: .5,
		        backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
		        // shadow: true
		    },*/
		    credits: {
		        enabled: false
		    },
			colors: [
				data.color
			],
		    series: [{
		        name: data.value_field,
		        data: values
		    }]
		});
        
        if(holder === "chart4"){
    		$("#" + holder).height(container_space * data.draw_height + "px");
    		$("#"+ holder + " .highcharts-series rect").css({"display": "none"});
    		$("#"+ holder + " .highcharts-grid-line").css({"display": "none"});
    	}

		
    }

    var mapCharts = {
    	"horizontal-bar": drawHorizontalBar,
    	"pie": drawPie
    }

    this.createChart = function(type, data, holder){
    	mapCharts[type](data, holder);
    }
    
});