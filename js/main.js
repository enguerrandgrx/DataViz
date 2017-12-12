//Width and height of map
var width = 960;
var height = 600;
var cmap = Purples;
var col = 'Armes/100 h.';

// D3 Projection
var projection = d3.geoAlbersUsa()
				   .translate([width/2, height/2])    // translate to center of screen
				   .scale([1000]);          // scale things down so see entire US

// Define path generator
const path = d3.geoPath()               // path generator that will convert GeoJSON to SVG paths
		  	 .projection(projection);  // tell path generator to use albersUsa projection

const svg = d3.select("#mapcontainer")
					.append("svg")
					.attr("width", width)
					.attr("height", height)
					.attr("id", "map");

// Draw the United States Map
d3.csv("data/usa.csv", function(data) {
	let n = 4;
	let col_values = [];

	d3.json("data/usa.json", function(states) {
		for(let i = 0; i < data.length; i++) {
			let dataState = data[i].State;
			let val = data[i][col];
			col_values.push(val);

			for(let j = 0; j < states.features.length; j++) {
				let jsonState = states.features[j].properties.name;
				if(dataState == jsonState) {
					states.features[j].properties.rate = val;
					break;
				}
			}
		}

		let values = new geostats(col_values);
		let bounds = values.getClassJenks(n);

		svg.selectAll("path")
		.data(states.features)
		.enter()
		.append("path")
		.attr("d", path)
		.style("fill", (d) => colormap(d.properties.rate, bounds, cmap));

		d3.csv("data/massshootings.csv", function(data) {
			let [mindate, maxdate] = getminmaxdate(data);

			draw_map(mindate, maxdate, data, $("#fatorinj").val())
			$('#leftvalue').html(get_date(mindate));
			$('#rightvalue').html(get_date(maxdate));

			$(function(){
				$('#fatorinj').change(function(){
					let val1 = $('#rangeslider').slider("values", 0);
					let val2 = $('#rangeslider').slider("values", 1);
					draw_map(val1, val2, data, $("#fatorinj").val());
				});

			  $('#rangeslider').slider({
					animate: "slow",
			    range: true,
			    min: mindate,
			    max: maxdate,
					step: 86400000,
			    values: [mindate, maxdate],
			    slide: function( event, ui ) {
						$('#leftvalue').html(get_date(ui.values[0]));
						$('#rightvalue').html(get_date(ui.values[1]));
						draw_map(ui.values[0], ui.values[1], data, $("#fatorinj").val());
			    }
			  });
			});
		});

	});
});


// Drawing events on the map given a dataset
function draw_map(from, to, data, option) {
	svg.selectAll("circle").remove();

	let data_filtered = data.filter(function(row) {
		date = Date.parse(row['Date']);
		in_range = (date > from) && (date < to);
		return in_range;
	});

	svg.selectAll("circle")
	.data(data_filtered)
	.enter()
	.append("circle")
	.attr("cx", (d) => projection([d.Longitude, d.Latitude])[0])
	.attr("cy", (d) => projection([d.Longitude, d.Latitude])[1])
	.attr("r", (d) => getEvents(d, option))
	.style("fill", colorEvents(option))
	.style("opacity", 0.3)
}
