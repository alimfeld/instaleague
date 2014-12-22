'use strict';

angular.module('instaleagueApp')
  .controller('ShowCompetitionCtrl', function ($scope, $location, $http, $modal, $timeout, _, Auth, league, competition) {

    var timeout = null;
    var stopWatching = null;
    var debounceSave = function(newValue, oldValue) {
      if (newValue !== oldValue) {
        $scope.dirty = true;
        if (timeout) {
          $timeout.cancel(timeout);
        }
        timeout = $timeout($scope.save, 3000);
      }
    };

    var setCompetition = function(competition) {
      $scope.dirty = false;
      if (stopWatching) {
        stopWatching();
      }
      competition.stats.sort(function(a, b) {
        return a.rank - b.rank;
      });
      $scope.competition = competition;
      // convert date from String to Date object
      $scope.competition.date = new Date(competition.date);
      stopWatching = $scope.$watch('competition', debounceSave, true);
    };

    var ensureNestedArray = function(array, index) {
      if (!_.isArray(array[index])) {
        array[index] = [];
      }
    };

    $scope.league = league.data;
    setCompetition(competition.data);

    $scope.save = function() {
      var data = {
        date: $scope.competition.date,
        competitors: $scope.competition.competitors,
        tags: $scope.competition.tags,
        results: $scope.competition.results
      };
      $http.put('/api/competitions/' + $scope.competition._id, data).success(function(competition) {
        setCompetition(competition);
      });
    };

    $scope.isCompetitor = function(competitor) {
      return $scope.competition.competitors.indexOf(competitor) > -1;
    };

    $scope.toggleCompetitor = function(competitor) {
      var idx = $scope.competition.competitors.indexOf(competitor);
      if (idx > -1) {
        $scope.competition.competitors.splice(idx, 1);
      } else {
        $scope.competition.competitors = $scope.competition.competitors.concat([competitor]).sort(function(a, b) { return a-b; });
      }
    };

    $scope.isTagSelected = function(competitor, tag) {
      var tags = $scope.competition.tags;
      ensureNestedArray(tags, competitor);
      return tags[competitor].indexOf(tag) > -1;
    };

    $scope.toggleTagSelection = function(competitor, tag) {
      var tags = $scope.competition.tags;
      ensureNestedArray(tags, competitor);
      var idx = tags[competitor].indexOf(tag);
      if (idx > -1) {
        tags[competitor].splice(idx, 1);
      } else {
        tags[competitor].push(tag);
      }
    };

    $scope.me = Auth.getCurrentUser();
    $scope.leagueOwner = $scope.me._id === $scope.league.owner;
    $scope.competitionOwner = $scope.me._id === $scope.competition.owner;
    $scope.readonly = !$scope.leagueOwner && $scope.competition.confirmed;

    $scope.confirm = function() {
      $http.post('/api/competitions/' + $scope.competition._id + '/actions', { action: 'confirm' }).success(function() {
        $location.path('/leagues/' + $scope.competition.league.id);
      });
    };

    $scope.delete = function() {
      $http.delete('/api/competitions/' + $scope.competition._id).success(function() {
        $location.path('/leagues/' + $scope.competition.league.id);
      });
    };
  });
