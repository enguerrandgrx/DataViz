//Width and height of map
var width = 960;
var height = 500;

// D3 Projection
var projection = d3.geoAlbersUsa()
				   .translate([width/2, height/2])    // translate to center of screen
				   .scale([1000]);          // scale things down so see entire US

// Define path generator
var path = d3.geoPath()               // path generator that will convert GeoJSON to SVG paths
		  	 .projection(projection);  // tell path generator to use albersUsa projection

const svg = d3.select("body")
					.append("svg")
					.attr("width", width)
					.attr("height", height);

const div = d3.select("body")
					.append("div")
					.style("opacity", 0);

d3.csv("massshootings.csv", function(data) {
	d3.json("usa.json", function(states) {

		for(let i = 0; i < states.features.length; i++) {
			let jsonState = states.features[i].properties.name;

		}

		svg.selectAll("path")
			.data(states.features)
			.enter()
			.append("path")
			.attr("d", path)
			.style("fill", "rgb(213,222,217)")

		//svg.selectAll("circle")
		//	.data(data)


	});
});
