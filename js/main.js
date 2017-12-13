//Width and height of map
var width = 960;
var height = 600;
var cmap = Purples;
var bounds;
var minDayVictims;
var maxDayVictims;

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
d3.csv("data/massshootings.csv", function(data) {

	let yearVictims = getYearVictims(data);
	let values = Object.values(yearVictims);
	values = values.map((v) => v/(365 * 51));

	minDayVictims = Math.min.apply(Math,values);
	maxDayVictims = Math.max.apply(Math,values);


	d3.json("data/usa.json", function(states) {
		svg.selectAll("path")
		.data(states.features)
		.enter()
		.append("path")
		.attr("d", path);

		let [mindate, maxdate] = getminmaxdate(data);

		draw_map(mindate, maxdate, data, $("#fatorinj").val(), states)
		$('#leftvalue').html(get_date(mindate));
		$('#rightvalue').html(get_date(maxdate));

		$(function(){
			$('#fatorinj').change(function(){
				let val1 = $('#rangeslider').slider("values", 0);
				let val2 = $('#rangeslider').slider("values", 1);
				draw_map(val1, val2, data, $("#fatorinj").val(), states);
			});

		  $('#rangeslider').slider({
				animate: "slow",
		    range: true,
		    min: mindate,
		    max: maxdate,
				step: 86400000,
		    values: [mindate, maxdate],
		    slide: function( event, ui ) {
					if(ui.values[1] - ui.values[0] < 86400000) {
						return false;
					}
					$('#leftvalue').html(get_date(ui.values[0]));
					$('#rightvalue').html(get_date(ui.values[1]));
					draw_map(ui.values[0], ui.values[1], data, $("#fatorinj").val(), states);
		    }
		  });
		});
	});
});


// Drawing events on the map given a dataset
function draw_map(from, to, data, option, states) {
	svg.selectAll("circle").remove();

	let range = (to - from) / 86400000;

	let data_filtered = data.filter(function(row) {
		date = Date.parse(row['Date']);
		in_range = (date >= from) && (date <= to);
		return in_range;
	});

	stateVictims = {};

	for(let i = 0; i < data_filtered.length; i++) {
		let dataState = data_filtered[i].State;
		let val = data_filtered[i][codeToName(option)];
		val /= range;

		if(stateVictims[dataState]) {
			stateVictims[dataState] += val;
		} else {
			stateVictims[dataState] = val;
		}
	}

	for(let j = 0; j < states.features.length; j++) {
		let jsonState = states.features[j].properties.name;
		if(stateVictims[jsonState]) {
			states.features[j].properties.victims = stateVictims[jsonState];
		} else {
			states.features[j].properties.victims = 0;
		}
	}

	console.log(minDayVictims)
	console.log(maxDayVictims)

	svg.selectAll("path")
		.data(states.features)
		.style("fill", function(d) {
			console.log(d.properties.name);
			console.log(d.properties.victims);
			return linearColormap(d.properties.victims, minDayVictims, maxDayVictims, cmap);
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
