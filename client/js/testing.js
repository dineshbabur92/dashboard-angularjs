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
value_min = 0;
var value_step_px =  (chart_div.width()/2) / ((value_max - value_min)*1.1);
var bar_height = (chart_div.height() / num_categories);

chart_div.append("<div class='row'> \
		<div id='category-axis-above' class='col-xs-6 axis-section-horizontal'></div> \
		<div id='value-axis-above' class='col-xs-6 axis-section-horizontal'></div> \
	</div");
chart_div.append("<div class='row'> \
		<div id='category-holder' class='col-xs-6 axis-section-horizontal'></div> \
		<div id='value-holder' class='col-xs-6 axis-section-horizontal'></div> \
	</div");
for(var di in data.data){
	$("#category-holder").append(
		"<div class='col-md-12 category item'>" 
		+ "<div id='label-" + di + "'>" + data.data[di][data.category_field] + "</div>"
		+ "<div class='indicator'>-</div>"
		+ "</div>"
	);
	$(".category.item").css({"height": bar_height +"px", "padding": "0px"});
	$("#label-" + di).css({"font-size": (bar_height * 0.8) + "px", "margin-top": (bar_height * 0.1) + "px", "margin-bottom": (bar_height * 0.1) + "px", "margin-right": "3px", "flex-grow": 1, "text-align": "left", "text-overflow": "ellipsis"});
	$("#value-holder").append(
		"<div class='col-md-12 value item'>" // + data.data[di][data.value_field] 
		+ "<div id='bar-" + di + "'></div>"
		+ "</div>"
	);
	$("#bar-" + di).css({"transition":"width linear 1s", "background-color": "#67b7dc", "width": value_step_px*(data.data[di][data.value_field]-value_min) +"px", "height": (bar_height * (8/10)) + "px", "margin-top": (bar_height * (2/10)) + "px", "margin-bottom": (bar_height * (2/10)) + "px"});
}

/*
var categoryTextElts = $("#chart1 > div > div.amcharts-chart-div > svg > g:nth-child(15) > g:nth-child(1) text tspan");
for(var i in categoryTextElts){
	console.log($(categoryTextElts[i]).text());
	var text = $(categoryTextElts[i]).text();
	if(text.length > 33){
		text = text.substring(0,30)+"...";
		$(categoryTextElts[i]).text(text);
	}
}

*/