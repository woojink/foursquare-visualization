d3.selection.prototype.moveToFront = function() {
  return this.each(function(){
    this.parentNode.appendChild(this);
  });
};

d3.csv("data/checkins_category.csv", function(error, data) {
  var checkins = d3.nest()
    .key(function(d){ return d.Category; })
    .key(function(d){ return d.Hour; })
    .map(data);
  
  // -----------------------------------------------------------------
  // Determine histogram bin heights for a given category
  function get_bin_height(category) {
    var bins = [];
    for (hour=0; hour<24; hour++) {
      bins.push({'hour': hour, 'count': (+checkins[category][hour][0].Count)})
    }
    return bins
  }

  // Set svg dimensions
  var svg_width=225, svg_height=225;

  // Set margins for each graph portion
  var margin = {
    'top': 0,
    'right': 0,
    'bottom': 2,
    'left': 2
  };

  // Determine graph dimensions
  var hist_width = svg_width - (margin.left + margin.right),
      hist_height = svg_height - (margin.top + margin.bottom);

  // Append SVGs
  var svg1 = d3.select("#category-sm1")
    .append('svg')
    .attr("viewBox", "0 0 " + svg_width + " " + svg_height)
    .style("max-width", svg_width + "px")
    .attr("preserveAspectRatio", "xMidYMid meet");
  var svg2 = d3.select("#category-sm2")
    .append('svg')
    .attr("viewBox", "0 0 " + svg_width + " " + svg_height)
    .style("max-width", svg_width + "px")
    .attr("preserveAspectRatio", "xMidYMid meet");
  var svg3 = d3.select("#category-sm3")
    .append('svg')
    .attr("viewBox", "0 0 " + svg_width + " " + svg_height)
    .style("max-width", svg_width + "px")
    .attr("preserveAspectRatio", "xMidYMid meet");
  var svg4 = d3.select("#category-sm4")
    .append('svg')
    .attr("viewBox", "0 0 " + svg_width + " " + svg_height)
    .style("max-width", svg_width + "px")
    .attr("preserveAspectRatio", "xMidYMid meet");
  var svg5 = d3.select("#category-sm5")
    .append('svg')
    .attr("viewBox", "0 0 " + svg_width + " " + svg_height)
    .style("max-width", svg_width + "px")
    .attr("preserveAspectRatio", "xMidYMid meet");
  var svg6 = d3.select("#category-sm6")
    .append('svg')
    .attr("viewBox", "0 0 " + svg_width + " " + svg_height)
    .style("max-width", svg_width + "px")
    .attr("preserveAspectRatio", "xMidYMid meet");

  // Append graph portion
  var hist1 = svg1.append("g")
    .attr('transform', "translate(" + margin.left + ", " + margin.top + ")");
  var hist2 = svg2.append("g")
    .attr('transform', "translate(" + margin.left + ", " + margin.top + ")");
  var hist3 = svg3.append("g")
    .attr('transform', "translate(" + margin.left + ", " + margin.top + ")");
  var hist4 = svg4.append("g")
    .attr('transform', "translate(" + margin.left + ", " + margin.top + ")");
  var hist5 = svg5.append("g")
    .attr('transform', "translate(" + margin.left + ", " + margin.top + ")");
  var hist6 = svg6.append("g")
    .attr('transform', "translate(" + margin.left + ", " + margin.top + ")");

  var bin_heights_temp = get_bin_height('Bar');
  // Scales
  var y_max = d3.max(bin_heights_temp, function(d){ return d['count']; });
  var x_scale = d3.scale.linear().domain([0, 23+1]).range([0, hist_width]),
      y_scale = d3.scale.linear().domain([0, y_max]).range([hist_height, 0]);

  // Axes
  var x_axis = d3.svg.axis().scale(x_scale).orient('top').tickFormat('').innerTickSize(2),
                // .tickValues([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23])
                // .tickFormat(function(d) { return d+":00";}),
      y_axis = d3.svg.axis().scale(y_scale).orient('left').tickFormat('').tickSize(0);

  hist1.append('g')
    .attr('class', 'axis').call(x_axis)
    .attr('transform', 'translate(0, ' + hist_height + ')');
  hist1.append('g')
    .attr('class', 'axis').call(y_axis);

  hist2.append('g')
    .attr('class', 'axis').call(x_axis)
    .attr('transform', 'translate(0, ' + hist_height + ')');
  hist2.append('g')
    .attr('class', 'axis').call(y_axis);

  hist3.append('g')
    .attr('class', 'axis').call(x_axis)
    .attr('transform', 'translate(0, ' + hist_height + ')');
  hist3.append('g')
    .attr('class', 'axis').call(y_axis);

  hist4.append('g')
    .attr('class', 'axis').call(x_axis)
    .attr('transform', 'translate(0, ' + hist_height + ')');
  hist4.append('g')
    .attr('class', 'axis').call(y_axis);

  hist5.append('g')
    .attr('class', 'axis').call(x_axis)
    .attr('transform', 'translate(0, ' + hist_height + ')');
  hist5.append('g')
    .attr('class', 'axis').call(y_axis);

  hist6.append('g')
    .attr('class', 'axis').call(x_axis)
    .attr('transform', 'translate(0, ' + hist_height + ')');
  hist6.append('g')
    .attr('class', 'axis').call(y_axis);

  var line = d3.svg.line()
    .x(function(d) {  return x_scale(d.hour); })
    .y(function(d) { return y_scale(d.count); });

  hist1.append('g').append('path')
    .datum(get_bin_height('Bar'))
    .attr('d', line)
    .style('fill', 'none')
    .style('stroke', 'red')
    .style('opacity', .6)
    .style('stroke-width', 2).moveToFront();
  hist2.append('g').append('path')
    .datum(get_bin_height('Coffee Shop'))
    .attr('d', line)
    .style('fill', 'none')
    .style('stroke', 'purple')
    .style('opacity', .6)
    .style('stroke-width', 2).moveToFront();
  hist3.append('g').append('path')
    .datum(get_bin_height('Gym / Fitness Center'))
    .attr('d', line)
    .style('fill', 'none')
    .style('stroke', 'orange')
    .style('opacity', .6)
    .style('stroke-width', 2).moveToFront();
  hist4.append('g').append('path')
    .datum(get_bin_height('Clothing Store'))
    .attr('d', line)
    .style('fill', 'none')
    .style('stroke', '#9bbb59')
    .style('opacity', .6)
    .style('stroke-width', 2).moveToFront();
  hist5.append('g').append('path')
    .datum(get_bin_height('Subway'))
    .attr('d', line)
    .style('fill', 'none')
    .style('stroke', '#808080')
    .style('opacity', .6)
    .style('stroke-width', 2).moveToFront();
  hist6.append('g').append('path')
    .datum(get_bin_height('College Academic Building'))
    .attr('d', line)
    .style('fill', 'none')
    .style('stroke', '#00b0f0')
    .style('opacity', .6)
    .style('stroke-width', 2).moveToFront();
})