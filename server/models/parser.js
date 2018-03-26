var moment = require('moment');

// Get maximum total sum for each date
// data: historical count data
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
// data: historical count data
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

// Get sum for each hour of days that fall on the current day of the week
// data: historical count data
function getHourlySums(data) {
  var day = moment().day();
  var sums = {};
  for (var i = 0; i < data.length; i++) {
    var item = data[i];
    var date = moment(item.date).format('L:H');
    if (moment(date, "MM/DD/YYYY").day() == day) {
      sums[date] = sums[date] || 0;
      sums[date] += item.count;
    }
  }
  return sums;
}

// Get hourly averages for current day of week of given data
// data: historical count data
function getHourlyAverages(data) {
  var occurrences = new Array(24).fill(0);
  var totals = new Array(24).fill(0);
  var result = new Array(24).fill(0);
  var sums = getHourlySums(data);
  for (date in sums) {
    var hourOfDay = moment(date, "MM/DD/YYYY:H").format('H');
    totals[hourOfDay] += sums[date];
    occurrences[hourOfDay]++;
  }
  for (var i = 0; i < 24; i++) {
    // For hourly data, we want summed counts up to that point, not just the individual
    // average count for a specific hour. So we need to add all the previous hour
    // counts to the current hour
    var countSoFar = i == 0 ? 0 : result[i - 1];
    result[i] = totals[i] / occurrences[i];
    result[i] += countSoFar;
  }
  return result;
}

module.exports.getDailyAverages = getDailyAverages;
module.exports.getHourlyAverages = getHourlyAverages;
