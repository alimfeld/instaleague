'use strict';
angular.module('instaleagueApp').directive('leagueChart', function () {
  return {
    restrict: 'E',
    scope: {
      league: '=',
      competitions: '='
    },
    link: function(scope) {
      var competitions = [].concat(scope.competitions);
      competitions.sort(function(a, b) {
        return new Date(a.date) - new Date(b.date);
      });
      var data = [];
      var x = 1;
      competitions.forEach(function(competition) {
        if (competition.confirmed) {
          var entry = {
            x: x
          };
          competition.stats.forEach(function(stat) {
            entry[stat.competitor] = stat.points;
          });
          data.push(entry);
          x += 1;
        }
      });
      scope.league.competitors.forEach(function(competitor, i) {
        var total = 0;
        var count = 0;
        var prev = 0;
        data.forEach(function(entry) {
          if (entry[i] !== undefined) {
            total += entry[i];
            count += 1;
            entry[i] = total / count;
            prev = entry[i];
          } else {
            entry[i] = prev;
          }
        });
      });
      var series = [];
      scope.league.competitors.forEach(function(competitor, i) {
        series.push({
          y: i,
          label: competitor
        });
      });
      var options = {
        axes: {
          x: { min: 1, max: x - 1, ticks: x - 2 },
          y: { min: 0, max: 1, ticks: 4 }
        },
        series: series,
        drawLegend: false,
        tooltip: {
          formatter: function(x, y, series) {
            return series.label + ': ' + y.toFixed(2);
          }
        }
      };
      scope.data = data;
      scope.options = options;
    },
    template: '<div style="width:100%"><linechart data="data" options="options"></linechart></div>'
  };
});
