d3.csv("data/checkins_hourly.csv", function(error, data) {
  var checkins = d3.nest()
    .key(function(d){ return d.Month; })
    .key(function(d){ return d.Day; })
    .key(function(d){ return d.Hour; })
    .map(data);

  // -----------------------------------------------------------------
  // Determine histogram bin heights given list of months and days
  function get_bin_height(months, days) {
    // Initialize histogram bins
    var bins = [];
    for (k=0; k<24; k++) { bins[k] = 0; }

    // Add up the checkins for the requested pairs of month/day
    for (month of months) {
      for (day of days) {
        for (hour=0; hour<24; hour++) {
          bins[hour] = bins[hour] + (+checkins[month][day][hour][0].Count);
        }
      }
    }
    return bins;
  }

  // Set svg dimensions and append
  var svg_width=1200, svg_height=500;
  var svg = d3.select("#histogram")
    .append('svg')
    .attr("viewBox", "0 0 " + svg_width + " " + svg_height)
    .style("max-width", svg_width + "px")
    .attr("preserveAspectRatio", "xMidYMid meet");

  // Set margins for the histogram portion
  var margin = {
    'top': 50,
    'right': 50,
    'bottom': 50,
    'left': 50
  };

  // Append histogram portion
  var hist = svg.append("g")
    .attr('transform', "translate(" + margin.left + ", " + margin.top + ")");

  var hist_width = svg_width - (margin.left + margin.right),
      hist_height = svg_height - (margin.top + margin.bottom);

  // By default, show all months and days
  var all_months = [1,2,4,5,6,7,8,9,10,11,12],
      all_days = [0,1,2,3,4,5,6];
  var bin_heights_temp = get_bin_height(all_months, all_days);

  // Scales
  var y_max = d3.max(bin_heights_temp);
  var x_scale = d3.scale.linear().domain([0, 23+1]).range([0, hist_width]),
      y_scale = d3.scale.linear().domain([0, y_max]).range([hist_height, 0]);

  // Axes
  var x_axis = d3.svg.axis().scale(x_scale).orient('bottom')
                .tickValues([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23])
                .tickFormat(function(d) { return d+":00";}),
      y_axis = d3.svg.axis().scale(y_scale).orient('left');

  hist.append('g')
    .attr('class', 'axis')
    .call(x_axis)
    .attr('transform', 'translate(0, ' + hist_height + ')');
  hist.append('g')
    .attr('class', 'axis')
    .attr('id', 'y-axis')
    .call(y_axis);

  bin_width = hist_width/24;
  bar_width = bin_width*.65;

  // Move the tick labels to the center of the bins
  hist.select('.axis').call(x_axis)
    .selectAll('text')
    .attr('transform', 'translate(' + (bin_width/2) + ', 5)')
    .style('text-anchor', 'center');

  // -----------------------------------------------------------------
  function update(months, days) {
    var bin_heights = get_bin_height(months, days);

    // Update the y-axis
    y_max = d3.max(bin_heights);
    y_scale.domain([0, y_max]);
    hist.select('#y-axis').transition().call(y_axis);

    var rectangles = hist.selectAll('rect')
      .data(bin_heights);
    
    rectangles
      .enter()
      .append('rect')
      .attr('fill', '#1c9099')
      .attr('width', bar_width)
      .attr('transform', 'translate(' + (bin_width-bar_width)/2 + ', 0)')
      .style('opacity', 0.8);

    // Update the bin heights
    rectangles
      .transition()
      .attr('x', function(d,index) {
        return x_scale(index);
      })
      .attr('y', function(d) {
        return y_scale(d);
      })
      .attr('height', function(d){
        return (hist_height - y_scale(d));
      });
  }

  // Initialize with all months and days
  update(all_months, all_days)

  var months = [1,2,4,5,6,7,8,9,10,11,12],
      days = [0,1,2,3,4,5,6];
  $(document).ready(function() {
    // Month selector
    $('.btn-month').click(function() {
      if ($(this).hasClass('active')) {
        $(this).removeClass('active');
        $(this).addClass('inactive');

        var month = $(this).attr('value'),
          i = months.indexOf(+month);
        if(i > -1) { months.splice(i, 1); }

        update(months, days);
      }
      else {
        $(this).removeClass('inactive');
        $(this).addClass('active');

        var month = $(this).attr('value');
        months.push(+month)

        update(months, days);
      }
    })

    // Day selector
    $('.btn-day').click(function() {
      if ($(this).hasClass('active')) {
        $(this).removeClass('active');
        $(this).addClass('inactive');

        var day = $(this).attr('value'),
          i = days.indexOf(+day);
        if(i > -1) { days.splice(i, 1); }

        update(months, days);
      }
      else {
        $(this).removeClass('inactive');
        $(this).addClass('active');

        var day = $(this).attr('value');
        days.push(+day)

        update(months, days);
      }
    })

    // Select just weekend
    $('.weekend-select').click(function() {
      days = [5,6];
      $('.day-weekday').each(function() {
        if ($(this).hasClass('active')) {
          $(this).removeClass('active');
          $(this).addClass('inactive');
        }
      })
      $('.day-weekend').each(function() {
        if ($(this).hasClass('inactive')) {
          $(this).removeClass('inactive');
          $(this).addClass('active');
        }
      })
      update(months, days);
    })

    // Select just weekdays
    $('.weekday-select').click(function() {
      days = [0,1,2,3,4];
      $('.day-weekend').each(function() {
        if ($(this).hasClass('active')) {
          $(this).removeClass('active');
          $(this).addClass('inactive');
        }
      })
      $('.day-weekday').each(function() {
        if ($(this).hasClass('inactive')) {
          $(this).removeClass('inactive');
          $(this).addClass('active');
        }
      })
      update(months, days);
    })

    // Select all / reset
    $('.select-all').click(function() {
      months = [1,2,3,4,5,6,7,8,9,10,11,12];
      days = [0,1,2,3,4,5,6];
      $('.btn-month').each(function() {
        if ($(this).hasClass('inactive')) {
          $(this).removeClass('inactive');
          $(this).addClass('active');
        }
      })
      $('.btn-day').each(function() {
        if ($(this).hasClass('inactive')) {
          $(this).removeClass('inactive');
          $(this).addClass('active');
        }
      })
      update(months, days);
    })

    // Deselect all
    $('.deselect-all').click(function() {
      months = [];
      days = [];
      $('.btn-month').each(function() {
        if ($(this).hasClass('active')) {
          $(this).removeClass('active');
          $(this).addClass('inactive');
        }
      })
      $('.btn-day').each(function() {
        if ($(this).hasClass('active')) {
          $(this).removeClass('active');
          $(this).addClass('inactive');
        }
      })
      update(months, days);
    })
  })
})