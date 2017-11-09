AmCharts.makeChart(holder, {

    type: "serial",
    theme: "light",
    dataProvider: data.data.sort(function(a,b){return a[data.value_field] > b[data.value_field] ? -1 : 1;}),
    categoryField: function(){
    	return this.category;
    },
    startDuration: 1,
    rotate: true,
    startEffect: "bounce",

    categoryAxis: {
        gridPosition: "start",
        centerLabels: true
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

// var rearrangeText = function(categoryTextElts){
// 	for(var i in categoryTextElts){
// 		// console.log($(categoryTextElts[i]).text());
// 		var text = $(categoryTextElts[i]).text();
// 		if(text.length > 33){
// 			text = text.substring(0,30)+"...";
// 			$(categoryTextElts[i]).remove('');
// 		}
// 	}
// }

// var chart1CategoryTextElts = $("#chart1 > div > div.amcharts-chart-div > svg > g:nth-child(15) > g:nth-child(1) text tspan");

// $('#chart1').on("DOMSubtreeModified",function(){
//   // console.log('chart1 changed');
// 	try{
// 		rearrangeText(chart1CategoryTextElts);
// 	}
// 	catch(e){
// 		// console.log("got a exception");
// 	}
  
// });

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