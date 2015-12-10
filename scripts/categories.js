d3.csv("data/top_categories.csv", function(error, data) {
  var checkins = d3.nest()
    .key(function(d){ return d.Borough; })
    .map(data);
  var categories = d3.nest()
    .key(function(d){ return d.Category; })
    .map(data);
  
  // Set svg dimensions and append
  var svg_width=1200, svg_height=525;
  var svg = d3.select("#category-chart")
    .append('svg')
    .attr("viewBox", "0 0 " + svg_width + " " + svg_height)
    .style("max-width", svg_width + "px")
    .attr("preserveAspectRatio", "xMidYMid meet");

  // Set margins for the histogram portion
  var margin = {
    'top': 0,
    'right': 5,
    'bottom': 25,
    'left': 10
  };

  // Append histogram portion
  var hist = svg.append("g")
  .attr('transform', "translate(" + margin.left + ", " + margin.top + ")");

  var hist_width = svg_width - (margin.left + margin.right),
      hist_height = svg_height - (margin.top + margin.bottom);

  // Scales
  var x_max = 15;
  var y_scale = d3.scale.ordinal()
                .rangeBands([0, hist_height], 0.3, 0.3),
      x_scale = d3.scale.linear()
                .domain([0, x_max])
                .range([0, hist_width]),
      color_scale = d3.scale.category20().domain(Object.keys(categories));

  // Axes
  var x_axis = d3.svg.axis().scale(x_scale).orient('bottom').tickFormat(function(d) { return d+"%"; }),
      y_axis = d3.svg.axis().scale(y_scale).orient('left');

  hist.append('g')
    .attr('class', 'axis')
    .attr('id', 'x-axis')
    .call(x_axis)
    .attr('transform', 'translate(0, ' + hist_height + ')');
  hist.append('g')
    .attr('class', 'axis')
    .call(y_axis);

  // -----------------------------------------------------------------
  function updategraph (checkins, boro) {
    var category_list = [];
    category_list.length = 0;
    
    // Retrieve the list for a specific borough
    i = 0
    while (i<12) {
      category_list.push({
        key: checkins[boro][i].Category,
        value: checkins[boro][i].Percentage
      });
      i++;
    }
    
    var category_key_list = [];
    category_key_list = category_list.map(function(d) { return d.key; });
    x_max = d3.max(checkins[boro], function(d){ return +d['Percentage']; })
    
    x_scale.domain([0, x_max*1.10]);
    y_scale.domain(category_key_list);

    hist.select('#x-axis').transition().call(x_axis)
    hist.select('#y-axis').transition().call(y_axis)

    var rectangles = hist.selectAll('rect')
      .data(category_list);

    rectangles
      .enter()
      .append('rect')
      .attr('height', y_scale.rangeBand());

    rectangles
      .attr('y', function(d) {
        return y_scale(d.key);
      })
      .attr('x', 1)
      .style('fill', function(d){
        return color_scale(d.key);
      })
      .style('opacity', 0.60)
      .transition()
      .attr('width', function(d){
        return x_scale(d.value);
      });

    rectangles.exit().remove();

    var labels = hist.selectAll("text")
      .data(category_list, function(d) { return d.key; });

    labels.enter()
      .append('text')
      .text(function(d) {
        return d.key;
      })
      .attr('y', function(d, i) {
        return y_scale(d.key) + y_scale.rangeBand();
      })
      .attr('x', function (d) {
        return x_scale(d.value) + 10;
      })
      .attr('class', 'boro-label')
      .style('text-anchor', 'begin');

    labels
      .attr('y', function(d, i) {
        return y_scale(d.key) + y_scale.rangeBand() -10;
      })
      .attr('x', function (d) {
        return x_scale(d.value) + 7;
    });
  }

  // Initial update
  updategraph(checkins, "Manhattan")

  $(document).ready(function() {
    $('.btn-boro').click(function() {
      var boro = $(this).attr('value');
      $(".boro-label").remove();
      updategraph(checkins, boro);
    })
  })
})