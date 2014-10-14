'use strict';

angular.module('instaleagueApp')
  .controller('NewcompetitionCtrl', function ($scope, $http, $stateParams, $location) {

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

    $scope.save = function() {
      $http.post('/api/competitions', {
        date: $scope.date,
        league: $scope.league._id,
        competitors: $scope.competitors,
        tags: $scope.tags,
        results: $scope.results
      }).success(function() {
        $location.path('');
      });
    };
  });
