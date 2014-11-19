'use strict';

angular.module('instaleagueApp')
  .controller('NewCompetitionCtrl', function ($scope, $http, $stateParams, $location, $modal) {

    var initScope = function() {
      $scope.date = new Date();
      $scope.competitors = [];
      $scope.results = [];
      $scope.tags = [];
      $scope.league.competitors.forEach(function(name, competitor) {
        $scope.competitors[competitor] = competitor;
        $scope.results[competitor] = [];
        $scope.tags[competitor] = [];
      });
    };

    var isFinished = function() {
      var result = true;
      $scope.competitors.forEach(function(competitor) {
        $scope.competitors.forEach(function(opponent) {
          if (competitor !== opponent) {
            if (($scope.results[competitor][opponent] === undefined) || ($scope.results[opponent][competitor] === undefined)) {
              result = false;
            }
          }
        });
      });
      return result;
    };

    $http.get('/api/leagues/' + $stateParams.league).success(function(league) {
      $scope.league = league;
      initScope();
    });

    $scope.isCompetitor = function(competitor) {
      return $scope.competitors.indexOf(competitor) > -1;
    };

    $scope.toggleCompetitor = function(competitor) {
      var idx = $scope.competitors.indexOf(competitor);
      if (idx > -1) {
        $scope.competitors.splice(idx, 1);
      } else {
        $scope.competitors = $scope.competitors.
          concat([competitor]).
          sort(function(a, b) { return a-b; });
      }
    };

    $scope.isTagSelected = function(competitor, tag) {
      return $scope.tags[competitor].indexOf(tag) > -1;
    };

    $scope.toggleTagSelection = function(competitor, tag) {
      var tags = $scope.tags[competitor];
      var idx = tags.indexOf(tag);
      if (idx > -1) {
        tags.splice(idx, 1);
      } else {
        tags.push(tag);
      }
    };

    $scope.updateStats = function() {
      $http.post('/api/competitions/rank', {
        competitors: $scope.competitors,
        results: $scope.results
      }).success(function(stats) {
        stats.sort(function(a, b) {
          return a.rank - b.rank;
        });
        $scope.stats = stats;
      });
    };

    $scope.save = function() {
      $http.post('/api/competitions', {
        date: $scope.date,
        league: $scope.league._id,
        competitors: $scope.competitors,
        tags: $scope.tags,
        results: $scope.results
      }).success(function(competition) {
        $location.path('/competitions/' + competition._id);
      });
    };

    $scope.editResult = function(competitor, opponent) {
      var modalInstance = $modal.open({
        templateUrl: 'app/newCompetition/editResult.html',
        controller: 'EditResultCtrl',
        size: 'lg',
        resolve: {
          entry: function() {
            return {
              competitor: competitor,
              opponent: opponent,
              competitorName: $scope.league.competitors[competitor],
              opponentName: $scope.league.competitors[opponent],
              plus: $scope.results[competitor][opponent],
              minus: $scope.results[opponent][competitor]
            };
          }
        }
      });

      modalInstance.result.then(function(entry) {
        $scope.results[entry.competitor][entry.opponent] = entry.plus;
        $scope.results[entry.opponent][entry.competitor] = entry.minus;
        $scope.finished = isFinished();
      });
    };

  });
