var moment = require('moment');

// Sum total counts for each date
function sumDates(data) {
  var result = {};
  for (var i = 0; i < data.length; i++) {
    var item = data[i];
    var date = moment(item.date).format('L');
    result[date] = result[date] || 0;
    result[date] += item.count;
  }
  return result;
}

// Get daily averages for given data
function getDailyAverages(data) {
  var occurrences = new Array(7).fill(0);
  var totals = new Array(7).fill(0);
  var result = new Array(7).fill(0);
  var sums = sumDates(data);
  for (date in sums) {
    var dayOfWeek = moment(date, "MM/DD/YYYY").day();
    totals[dayOfWeek] += sums[date];
    occurrences[dayOfWeek]++;
  }
  for (var i = 0; i < 7; i++) {
    result[i] = totals[i] / occurrences[i];
  }
  return result;
}

module.exports.sumDates = sumDates;
module.exports.getDailyAverages = getDailyAverages;
