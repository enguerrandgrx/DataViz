//Width and height of map
var width = 960;
var height = 600;

// D3 Projection
var projection = d3.geoAlbersUsa()
				   .translate([width/2, height/2])    // translate to center of screen
				   .scale([1000]);          // scale things down so see entire US

// Define path generator
const path = d3.geoPath()               // path generator that will convert GeoJSON to SVG paths
		  	 .projection(projection);  // tell path generator to use albersUsa projection

const svg = d3.select("body")
					.append("svg")
					.attr("width", width)
					.attr("height", height)
					.attr("id", "map");

// Draw the United States Map
d3.json("data/usa.json", function(states) {
	svg.selectAll("path")
	.data(states.features)
	.enter()
	.append("path")
	.attr("d", path)
	.style("fill", "rgb(200,200,217)")
});

// Draw the events on the map depending on the slider modifications
d3.csv("data/massshootings.csv", function(data) {
	let mindate = Infinity;
	let maxdate = -Infinity;
	data.forEach(function(d) {
		date = Date.parse(d.Date);
		if(date < mindate) {
			mindate = date;
		}
		if(date > maxdate) {
			maxdate = date;
		}
	});

	draw_map(mindate, maxdate, data)
	$('#leftvalue').html(new Date(mindate).toDateString());
	$('#rightvalue').html(new Date(maxdate).toDateString());

	$(function(){
	  $('#rangeslider').slider({
			animate: "slow",
	    range: true,
	    min: mindate,
	    max: maxdate,
			step: 86400000,
	    values: [ mindate, maxdate],
	    slide: function( event, ui ) {
				$('#leftvalue').html(new Date(ui.values[0]).toDateString());
				$('#rightvalue').html(new Date(ui.values[1]).toDateString());
	    },
			change: function( event, ui ) {
				draw_map(ui.values[0], ui.values[1], data);
			}

	  });
	});

});


// Drawing events on the map given a dataset
function draw_map(from, to, data) {
	svg.selectAll("circle").remove();

	let data_filtered = data.filter(function(row) {
		console.log(projection([row.Longitude, row.Latitude]));
		date = Date.parse(row['Date']);
		in_range = (date > from) && (date < to);
		return in_range;
	});
	let c = 0;
	svg.selectAll("circle")
	.data(data_filtered)
	.enter()
	.append("circle")
	//.attr("cx", (d) => projection([d.Longitude, d.Latitude])[0])
	.attr("cx", function(d){
		console.log(c);
		c = c + 1;
		console.log(d.Date);
		console.log(d.Longitude);
		return projection([d.Longitude, d.Latitude])[0];
	})
	.attr("cy", (d) => projection([d.Longitude, d.Latitude])[1])
	.attr("r", (d) => 1 + Math.sqrt(d.Fatalities))
	.style("fill", "rgb(225, 10, 10)")
	.style("opacity", 0.2)
}
