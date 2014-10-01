'use strict';

angular.module('instaleagueApp')
  .controller('NewcompetitionCtrl', function ($scope, $http, $stateParams) {

    var init = function() {
      $scope.active = [];
      $scope.score = [];
      $scope.tags = [];
      $scope.results = [];
      $scope.league.competitors.forEach(function(competitor, i) {
        $scope.active[i] = true;
        $scope.score[i] = [];
        $scope.tags[i] = [];
      });
    };

    var initResult = function(i) {
      $scope.results[i] = {
        games: 0,
        wins: 0,
        losses: 0,
        draws: 0,
        plus: 0,
        minus: 0,
        score: 0,
        rank: 0
      };
    };

    $http.get('/api/leagues/' + $stateParams.league).success(function(league) {
      $scope.league = league;
      init();
    });

    $scope.updateResults = function() {
      $scope.league.competitors.forEach(function(competitor, me) {
        initResult(me);
        if (!$scope.active[me]) {
          return;
        }
        $scope.score[me].forEach(function(score, opponent) {
          if (!$scope.active[opponent]) {
            return;
          }
          var against = $scope.score[opponent][me];
          if (score !== undefined && against !== undefined) {
            $scope.results[me].games += 1;
            if (score > against) {
              $scope.results[me].wins += 1;
              $scope.results[me].score += 2;
            }
            if (score < against) {
              $scope.results[me].losses += 1;
            }
            if (score === against) {
              $scope.results[me].draws += 1;
              $scope.results[me].score += 1;
            }
            $scope.results[me].plus += score;
            $scope.results[me].minus += against;
          }
        });
      });
    };
  });
