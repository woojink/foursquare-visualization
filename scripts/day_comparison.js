// Move element to front (https://gist.github.com/trtg/3922684)
d3.selection.prototype.moveToFront = function() {
  return this.each(function(){
    this.parentNode.appendChild(this);
  });
};

d3.csv("data/checkins_day.csv", function(error, data) {
  var checkins = d3.nest()
    .key(function(d){ return d.Day; })
    .key(function(d){ return d.Hour; })
    .map(data);

  var day_bins = [],
    all_months = [1,2,4,5,6,7,8,9,10,11,12],
    all_days = [0,1,2,3,4,5,6]
    day_dict = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  day_bins = []
  for (day of all_days) {
    day_bin = []
    for (hour=0; hour<24; hour++) {
      day_bin.push({'hour': hour, 'count': +checkins[day][hour][0].Count})
    }
    day_bins.push({'day': day, 'bin_heights': day_bin})
  }

  // Set svg dimensions
  var svg_width=750, svg_height=300;

  // Set margins for each graph portion
  var margin = {
    'top': 0,
    'right': 0,
    'bottom': 25,
    'left': 25
  };

  // Determine graph dimensions
  var hist_width = svg_width - (margin.left + margin.right),
      hist_height = svg_height - (margin.top + margin.bottom);

  // Append SVGs
  var svg = d3.select("#day-comparison")
    .append('svg')
    .attr("viewBox", "0 0 " + svg_width + " " + svg_height)
    .style("max-width", svg_width + "px")
    .attr("preserveAspectRatio", "xMidYMid meet");

  // Ordinal colour scale
      var color_scale = d3.scale.category10();

  // Append graph portion
  var hist = svg.append("g")
    .attr('transform', "translate(" + margin.left + ", " + margin.top + ")");

  var y_max = d3.max(day_bins[0]['bin_heights'], function(d){ return +d['count'] });
  var x_scale = d3.scale.linear().domain([0, 23]).range([0, hist_width]),
      y_scale = d3.scale.linear().domain([0, y_max*1.1]).range([hist_height, 0]);

  // Axes
  all_hours = [0.5,6.5,12.5,18.5]
  var x_axis = d3.svg.axis().scale(x_scale).orient('top').tickValues(all_hours).tickFormat('').innerTickSize(3),
      y_axis = d3.svg.axis().scale(y_scale).orient('left').tickFormat('').tickSize(0);

  hist.append('g')
    .attr('class', 'axis').call(x_axis)
    .attr('transform', 'translate(0, ' + hist_height + ')');
  hist.append('g')
    .attr('class', 'axis').call(y_axis);

  // y-axis label
  label_offset_x = 20
  var y_text = svg.append('text')
    .attr('x', label_offset_x)
    .attr('y', svg_height/2-10)
    .attr('text-anchor', 'middle')
    .attr('id', 'yaxis_label')
    .attr('class', 'axis-label')
    .attr('transform','rotate(-90 ' + label_offset_x + ' ' + (svg_height/2-5) + ')')
    .text('Check-ins');
  var x_text = svg.append('text')
    .attr('x', svg_width/2)
    .attr('y', svg_height-5)
    .attr('text-anchor', 'middle')
    .attr('id', 'xaxis_label')
    .attr('class', 'axis-label')
    .text('Time');

  var line = d3.svg.line()
    .x(function(d) {  return x_scale(d.hour); })
    .y(function(d) { return y_scale(d.count); })
    .interpolate('cardinal');

  hist.append('g').selectAll('path')
    .data(day_bins)
    .enter()
    .append('path')
    .attr('d', function(d){
      return line(d['bin_heights']);
    })
    .style('fill', 'none')
    .style('stroke', function(d){ return color_scale(d.day) })
    .style('opacity', .6)
    .style('stroke-width', 2)
    .on('mouseover', function(d){
      var parentOffset = $(this).parent().offset();
      d3.select(this).moveToFront();
      d3.select(this).style('stroke-width', 5);
      d3.select('#dc-tooltip')
        .style('visibility','visible')
        .style('top', d3.event.pageY+10-parentOffset.top + 'px')
        .style('left', d3.event.pageX+20-parentOffset.left + 'px')
        .html(day_dict[d['day']])
        .transition().style('opacity', .9);
    })
    .on('mouseout', function(d){
      d3.select(this).style('stroke-width', 2);
      d3.select('#dc-tooltip')
        .transition().style('opacity', 0);
    });
})