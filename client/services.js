efasApp.service("charts", function(){
    
	var container_space = $(window).innerHeight() * .85
	
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
	        plotShadow: false,
	        type: 'pie'
	    },
	    title: {
	        text: data.title
	    },
	    tooltip: {
	        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
	    },
	    plotOptions: {
	        pie: {
	            allowPointSelect: true,
	            cursor: 'pointer',
	            // dataLabels: {
	            //     enabled: true,
	            //     format: '<b>{point.name}</b>: {point.percentage:.1f} %',
	            //     style: {
	            //         color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
	            //     }
	            // },
	            dataLabels: {
	                enabled: false
	            },
	            showInLegend: true
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
		        type: 'bar'
		        // marginRight: holder === "chart4" ? undefined : 50
		    },
		    title: {
		        text: data.title
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
			        var tooltipX = holder === "chart4" ? point.plotX + 400 : point.plotX;
			        var tooltipY = point.plotY;
			        return {
			            x: tooltipX,
			            y: tooltipY
			        };
			    },
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
			    backgroundColor: "rgba(255,255,255,1)"
		    },
		    plotOptions: {
		        bar: {
		            dataLabels: {
		                enabled: true
		            }
		        }
		    },
		    // tooltip: {
		    //     pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
		    // },
		    legend: {
		        layout: 'vertical',
		        align: holder == "chart4" ? "left" : "right",
		        verticalAlign: holder == "chart4" ? "top" : "bottom",
		        x: 0,
		        y: -50,
		        floating: true,
		        borderWidth: .5,
		        backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
		        // shadow: true
		    },
		    credits: {
		        enabled: false
		    },
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