function getminmaxdate(data) {
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
  return [mindate, maxdate];
}

function get_date(d) {
  let monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];
  d = new Date(d);
  result = d.getDate() + ' ' + monthNames[d.getMonth()] + '<br />' + d.getFullYear();
  return result;
}

function enforceBounds(x) {
    if (x < 0) {
        return 0;
    } else if (x > 1){
        return 1;
    } else {
        return x;
    }
}

function interpolateLinearly(x, values) {

    // Split values into four lists
    var x_values = [];
    var r_values = [];
    var g_values = [];
    var b_values = [];
    for (i in values) {
        x_values.push(values[i][0]);
        r_values.push(values[i][1][0]);
        g_values.push(values[i][1][1]);
        b_values.push(values[i][1][2]);
    }

    var i = 1;
    while (x_values[i] < x) {
        i = i+1;
    }
    i = i-1;

    var width = Math.abs(x_values[i] - x_values[i+1]);
    var scaling_factor = (x - x_values[i]) / width;

    // Get the new color values though interpolation
    var r = r_values[i] + scaling_factor * (r_values[i+1] - r_values[i])
    var g = g_values[i] + scaling_factor * (g_values[i+1] - g_values[i])
    var b = b_values[i] + scaling_factor * (b_values[i+1] - b_values[i])

    return [enforceBounds(r), enforceBounds(g), enforceBounds(b)];

}

function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(c) {
  return "#" + componentToHex(c[0]) + componentToHex(c[1]) + componentToHex(c[2]);
}

function colormap(value, bounds, cmap) {
  let c = 0;
  while(value > bounds[c]) {
    c++;
  }
  let color = interpolateLinearly(0.1 + c/10, cmap);
  color = color.map((a) => Math.round(255*a));

  return rgbToHex(color);
}

function colorEvents(option) {
  let color;
	switch (option) {
		case 'f':
			color = "rgb(225, 10, 10)";
			break;
		case 'i':
			color = "rgb(225, 10, 10)";
			break;
    case 't':
      color = "rgb(225, 10, 10)"
      break;
	}
	return color;
}

function getEvents(d, option) {
  let val;
  switch (option) {
    case 'f':
      val = d.Fatalities;
      break;
    case 'i':
      val = d.Injured;
      break;
    case 't':
      val = d['Total victims'];
      break;
  }
  return 2 + Math.sqrt(val);
}
