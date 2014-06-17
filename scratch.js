var windrose = 
{
	degreesInCircle: 360,
	directions8: ["N", "NE", "E", "SE", "S", "SW", "W", "NW"],
	directions16: [	"N", "NNE", "NE", "ENE", 
					"E", "ESE", "SE", "SSE",
					"S", "SSW", "SW", "WSW",
					"W", "WNW", "NW", "NNW" ],
	config: { 	
		"0-10": { "fill": "#FFFF99"},
		"10-20": { "fill": "#FFFF33"},
		"20-30": { "fill": "#FFCC00" },
		">30": { "fill": "#FF9900"}
	},
	angles: function(directions) { 
		var slices = directions.length;
		var factor =  -0.5; // North start at halfway mark between N and NW or NNW
		var angs = {};
		for(var i in directions) {
			angs[directions[i]] = { "start": (windrose.degreesInCircle/slices*factor), "end": (windrose.degreesInCircle/slices*(++factor)) };
		}
		return angs;
	},
	maxLength: function(data) {
		var max = 0;
		function gt(val) { if(val > max) { max = val; }};
		var calm = 0;
		var len = 0;
		for(var dir in data) {
			if(dir === "calm") { calm = data[dir]; }
			else { 
				len = 0;
				for(var bin in data[dir]) { 
					len+=data[dir][bin];
				}
			}
			gt(len+calm); 
		}
		return max;
	},
	domain: function(data) { return Math.ceil(windrose.maxLength(data) / 10) * 10; },
	draw_frequency_circles: function(domain, center,svgContainer)
	{
		for (var freq = domain; freq >= 5; freq-=10)
		{
			svgContainer.append("circle")
						.attr("cx", center.x)
						.attr("cy", center.y)
						.attr("r", freq)
						.style("fill", "white")
						.style("stroke", "black")
						.style("stroke-dasharray", "5,5");
		}
	},
	draw_chunk: function(dir, bin, freq, offset, center, angles, svgContainer)
	{	
		var arc = d3.svg.arc()	
			.innerRadius(offset)
			.outerRadius(offset + freq)
			.startAngle(windrose.rad(angles[dir].start))
			.endAngle(windrose.rad(angles[dir].end))

		svgContainer.append("path")
			.attr("d", arc)
			.attr("fill", windrose.config[bin]["fill"])
			.attr("fill-opacity", 0.5)
			.style("stroke", "black")
			.attr("transform", "translate(" + center.x + "," + center.y + ")")
			.append("title")
			.text("" + dir + " " + bin + " m/s " + freq + "%");	

		return offset + freq;
	},	
	draw_rose: function(data, center, svgContainer) { 
		data = typeof data !== 'undefined' ? data: { 	"calm": 8,
					"N": { "0-10": 3, "10-20": 12, "20-30": 0, ">30": 0 },
					"NNE": { "0-10": 4, "10-20": 9, "20-30": 2, ">30": 0 },
					"NE": { "0-10": 0, "10-20": 20, "20-30": 0, ">30": 0 },
					"ENE": { "0-10": 0, "10-20": 2, "20-30": 0, ">30": 0 },
					"E": { "0-10": 0, "10-20": 5, "20-30": 0, ">30": 0 },
					"ESE": { "0-10": 0, "10-20": 5, "20-30": 0, ">30": 0 },					
					"SE": { "0-10": 0, "10-20": 0, "20-30": 0, ">30": 0 },
					"SSE": { "0-10": 0, "10-20": 0, "20-30": 0, ">30": 0 },
					"S": { "0-10": 20, "10-20": 30, "20-30": 10, ">30": 10 },
					"SSW": { "0-10": 23, "10-20": 0, "20-30": 0, ">30": 0 },
					"SW": { "0-10": 23, "10-20": 0, "20-30": 0, ">30": 0 },
					"WSW": { "0-10": 0, "10-20": 11, "20-30": 0, ">30": 0 },
					"W": { "0-10": 0, "10-20": 11, "20-30": 0, ">30": 0 },
					"WNW": { "0-10": 0, "10-20": 11, "20-30": 0, ">30": 0 },
					"NW": { "0-10": 0, "10-20": 0, "20-30": 0, ">30": 0 },
					"NNW": { "0-10": 0, "10-20": 0, "20-30": 0, ">30": 0 } 
				};
		center = typeof center !== 'undefined' ? center : {x: 100,y: 80};
		svgContainer = typeof svgContainer !== 'undefined' ? svgContainer : d3.select("body").append("svg")
									.attr("width", 300)
									.attr("height", 300);
		windrose.draw_frequency_circles(windrose.domain(data), center,svgContainer);
		
		// todo: determine number of angles from the data provided
		var angles = windrose.angles(windrose.directions16);

		for(var dir in data)
		{
			if(dir === "calm") {}
			else {
				var offset = data["calm"]; 	
				for(var bin in data[dir])
				{	
					console.log(dir + "," +bin + "," + data[dir][bin] + "," + offset + "," + center);
					offset = windrose.draw_chunk(dir, bin, data[dir][bin], offset, center, angles, svgContainer);
				}
			}
		}
	},
	bomStyle:
	{
		config: { 	
			"0-10": { "fill": "#FFFF99", "width": 4 },
			"10-20": { "fill": "#FFFF33", "width": 8 },
			"20-30": { "fill": "#FFCC00", "width": 12 },
			">30": { "fill": "#FF9900", "width": 16 }
		}
	},
	
	/** Converts degrees to radians */
	rad: function(deg)
	{
		return deg * (Math.PI/180);
	}
};