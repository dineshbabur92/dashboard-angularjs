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