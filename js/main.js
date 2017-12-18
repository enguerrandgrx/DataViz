//Width and height of map
var width = 960;
var height = 600;
var barchartwidth = "100%";
var barchartheight = 400;
var barswidth = 80;
var cmap = Purples;
var maxDayVictims;
var sliderLeft;
var sliderRight;
var moveSlider;
var mindate;
var maxdate;
var type = $("#fatorinj").val();
var legendWidth = 0.4 * width,
		legendHeight = 10;
var sumVictims;
var ratio = 400;

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

const barchartsvg = d3.select("#barchartcontainer")
					.append("svg")
					.attr("width", barchartwidth)
					.attr("height", barchartheight)
					.attr("id", "barchart");

d3.csv("data/massshootings.csv", function(data) {

	let yearVictims = getYearVictims(data);
	let values = Object.values(yearVictims);
	values = values.map((v) => v/(365 * 51));
	maxDayVictims = Math.max.apply(Math,values);
	createLegend();

	barchartsvg.append("rect")
					.style("fill", "#a54446")
					.attr("x","50%")
					.attr("transform", "translate("+ -barswidth/2 + ",0)")
					.attr("y", barchartheight)
					.attr("width", barswidth)
					.attr("height", 0);

	barchartsvg.append("text")
					.attr("class", "legendTitle")
					.attr("x", "50%")
					.attr("y", barchartheight + 5)
					.style("text-anchor", "middle")

	d3.json("data/usa.json", function(states) {
		svg.selectAll("path")
		.data(states.features)
		.enter()
		.append("path")
		.attr("d", path);

		[mindate, maxdate] = getminmaxdate(data);
		[sliderLeft, sliderRight] = [mindate, maxdate];

		draw_map(sliderLeft, sliderRight, data, type, states)
		$('#leftvalue').html(get_date(mindate));
		$('#rightvalue').html(get_date(maxdate));

		$(function() {
			$('#fatorinj').change(function(){
				type = $("#fatorinj").val();
				draw_map(sliderLeft, sliderRight, data, type, states);
			});

		  $('#rangeslider').slider({
				animate: "slow",
		    range: true,
		    min: mindate,
		    max: maxdate,
				step: 86400000,
		    values: [mindate, maxdate],
		    slide: function( event, ui ) {
					sliderLeft = ui.values[0];
					sliderRight = ui.values[1];
					if(sliderRight - sliderLeft < 86400000) {
						return false;
					}
					updateDateText(sliderLeft, sliderRight);
					draw_map(sliderLeft, sliderRight, data, type, states);
		    },
				change: function( event, ui ) {
					updateDateText(sliderLeft, sliderRight);
					draw_map(sliderLeft, sliderRight, data, type, states);
				}
		  });
		});
	});
});


// Drawing events on the map given a dataset
function draw_map(from, to, data, option, states) {
	svg.selectAll("circle").remove();

	let range = (to - from) / 86400000;

	let dataFiltered = data.filter(function(row) {
		date = Date.parse(row['Date']);
		in_range = (date >= from) && (date <= to);
		return in_range;
	});

	stateVictims = {};

	for(let i = 0; i < dataFiltered.length; i++) {
		let dataState = dataFiltered[i].State;
		let val = dataFiltered[i][codeToName(option)];
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

	svg.selectAll("path")
		.data(states.features)
		.style("fill", function(d) {
			return linearColormap(d.properties.victims,
																						maxDayVictims, cmap);
		});

	svg.selectAll("circle")
	.data(dataFiltered)
	.enter()
	.append("circle")
	.attr("cx", (d) => projection([d.Longitude, d.Latitude])[0])
	.attr("cy", (d) => projection([d.Longitude, d.Latitude])[1])
	.attr("r", (d) => getEvents(d, option))
	.style("fill", colorEvents(option))
	.style("opacity", 0.3)

	sumVictims = d3.sum(dataFiltered, (d) => d["Total victims"]) / range;
	sumVictimsRatio = sumVictims * ratio;
	acceptableValue = Math.min(350, sumVictimsRatio)

	barchartsvg.selectAll("rect")
						.attr("y", barchartheight - acceptableValue)
						.attr("height", acceptableValue);

	barchartsvg.selectAll("text")
						.attr("y", barchartheight - acceptableValue - 15)
						.text(sumVictims.toFixed(2))

}
