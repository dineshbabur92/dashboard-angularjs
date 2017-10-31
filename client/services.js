efasApp.service("d3Service", function(){
    
    var drawHorizontalBar = function(data, holder){

    	var data = [{
                "name": "Apples",
                "value": 20,
        },
            {
                "name": "Bananas",
                "value": 12,
        },
            {
                "name": "Grapes",
                "value": 19,
        },
            {
                "name": "Lemons",
                "value": 5,
        },
            {
                "name": "Limes",
                "value": 16,
        },
            {
                "name": "Oranges",
                "value": 26,
        },
            {
                "name": "Pears",
                "value": 30,
        }];

        //sort bars based on value
        data = data.sort(function (a, b) {
            return d3.ascending(a.value, b.value);
        })

        //set up svg using margin conventions - we'll need plenty of room on the left for labels
        var margin = {
            top: 15,
            right: 25,
            bottom: 15,
            left: 60
        };

        var width = $(holder).width() * .9 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        var svg = d3.select(holder).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var x = d3.scale.linear()
            .range([0, width])
            .domain([0, d3.max(data, function (d) {
                return d.value;
            })]);

        var y = d3.scale.ordinal()
            .rangeRoundBands([height, 0], 0.1)
            .domain(data.map(function (d) {
                return d.name;
            }));

           console.log('scale: ', y);
        //make y axis to show bar names
        var yAxis = d3.svg.axis()
            .scale(y)
            //no tick marks
            .tickSize(0)
            .orient("left");

        var gy = svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)

        var bars = svg.selectAll(".bar")
            .data(data)
            .enter()
            .append("g")

        //append rects
        bars.append("rect")
            .attr("class", "bar")
            .attr("y", function (d) {
                return y(d.name);
            })
            .attr("height", y.rangeBand())
            .attr("x", 0)
            .attr("width", function (d) {
                return x(d.value);
            });

        //add a value label to the right of each bar
        bars.append("text")
            .attr("class", "label")
            //y position of the label is halfway down the bar
            .attr("y", function (d) {
                return y(d.name) + y.rangeBand() / 2 + 4;
            })
            //x position is 3 pixels to the right of the bar
            .attr("x", function (d) {
                return x(d.value) + 3;
            })
            .text(function (d) {
                return d.value;
            });

    }

    var drawPie = function(data, holder){

    	var w = $(holder).width(),                        //width
	    h = 200,                            //height
	    r = w < h ? w/2 : h/2,                            //radius
	    color = d3.scale.category20();     //builtin range of colors
	    console.log("svg width: "+ w);
	    console.log($(holder));

	    data = [{"label":"one", "value":20}, 
	            {"label":"two", "value":50}, 
	            {"label":"three", "value":30},{"label":"one", "value":20}, 
	            {"label":"two", "value":50}, 
	            {"label":"three", "value":30}];
	    
	    var vis = d3.select(holder)
	        .append("svg:svg")              //create the SVG element inside the <body>
	        .data([data])                   //associate our data with the document
	            .attr("width", w)           //set the width and height of our visualization (these will be attributes of the <svg> tag
	            .attr("height", h)
	        .append("svg:g")                //make a group to hold our pie chart
	            .attr("transform", "translate(" + r + "," + r + ")")    //move the center of the pie chart from 0, 0 to radius, radius

	    var arc = d3.svg.arc()              //this will create <path> elements for us using arc data
	        .outerRadius(r);

	    var pie = d3.layout.pie()           //this will create arc data for us given a list of values
	        .value(function(d) { return d.value; });    //we must tell it out to access the value of each element in our data array

	    var arcs = vis.selectAll("g.slice")     //this selects all <g> elements with class slice (there aren't any yet)
	        .data(pie)                          //associate the generated pie data (an array of arcs, each having startAngle, endAngle and value properties) 
	        .enter()                            //this will create <g> elements for every "extra" data element that should be associated with a selection. The result is creating a <g> for every object in the data array
	            .append("svg:g")                //create a group to hold each slice (we will have a <path> and a <text> element associated with each slice)
	                .attr("class", "slice");    //allow us to style things in the slices (like text)

	        arcs.append("svg:path")
	                .attr("fill", function(d, i) { return color(i); } ) //set the color for each slice to be chosen from the color function defined above
	                .attr("d", arc);                                    //this creates the actual SVG path using the associated data (pie) with the arc drawing function

	        arcs.append("svg:text")                                     //add a label to each slice
	                .attr("transform", function(d) {                    //set the label's origin to the center of the arc
	                //we have to make sure to set these before calling arc.centroid
	                d.innerRadius = 0;
	                d.outerRadius = r;
	                return "translate(" + arc.centroid(d) + ")";        //this gives us a pair of coordinates like [50, 50]
	            })
	            .attr("text-anchor", "middle")                          //center the text on it's origin
	            .text(function(d, i) { return data[i].label; });  

    }

    var mapCharts = {
    	"horizontal-bar": drawHorizontalBar,
    	"pie": drawPie
    }

    this.createChart = function(type, data, holder){

    	mapCharts[type](data, holder);

    }
    
});