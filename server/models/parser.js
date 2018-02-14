var moment = require('moment');

// Get maximum total sum for each date
function getMaxSums(data) {
  var sums = {};
  var max = {};
  for (var i = 0; i < data.length; i++) {
    var item = data[i];
    var date = moment(item.date).format('L');
    sums[date] = sums[date] || 0;
    sums[date] += item.count;
    if (!max[date] || sums[date] > max[date]) {
      max[date] = sums[date];
    }
  }
  return max;
}

// Get daily averages for given data
function getDailyAverages(data) {
  var occurrences = new Array(7).fill(0);
  var totals = new Array(7).fill(0);
  var result = new Array(7).fill(0);
  var maxSums = getMaxSums(data);
  for (date in maxSums) {
    var dayOfWeek = moment(date, "MM/DD/YYYY").day();
    totals[dayOfWeek] += maxSums[date];
    occurrences[dayOfWeek]++;
  }
  for (var i = 0; i < 7; i++) {
    result[i] = totals[i] / occurrences[i];
  }
  return result;
}

module.exports.getDailyAverages = getDailyAverages;
