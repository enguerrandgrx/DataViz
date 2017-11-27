const width = 1100;
const height = 700;

// D3 Projection
const projection = d3.geoNaturalEarth1()
	.rotate([0, 0])
	.center([-95.7, 37.1])
	.scale(16000)
	.translate([width / 2, height / 2])
	.precision(.1);

// path generator to convert JSON to SVG paths
const path = d3.geoPath()
	.projection(projection);

//colormap for population density
const color = d3.scaleLog()
	.range(["hsl(62,100%,90%)", "hsl(228,30%,20%)"])
	.interpolate(d3.interpolateHcl);

const svg = d3.select("body")
	.append("svg")
	.attr("width", width)
	.attr("height", height);

const div = d3.select("body")
	.append("div")
	.style("opacity", 0);

d3.json("https://raw.githubusercontent.com/enguerrandgrx/DataViz/master/topojson/countries/USA.json", function(json) {
	// Map instagram posts
	d3.csv("locations.csv", function(data) {
			svg.selectAll("circle")
				.data(data)
				.enter()
				.append("circle")
				.attr("cx", (d) => projection([d.lon, d.lat])[0])
				.attr("cy", (d) => projection([d.lon, d.lat])[1])
				.attr("r", 5)
				.style("fill", "#FF0000")
				.style("opacity", 0.05)
		});
	});
