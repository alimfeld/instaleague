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

    $scope.result = function(competitor, opponent, result) {
      if (_.isNumber(result)) {
        // set
        ensureNestedArray($scope.competition.results, competitor);
        $scope.competition.results[competitor][opponent] = result;
      } else {
        // get
        if ($scope.competition.results[competitor]) {
          return $scope.competition.results[competitor][opponent];
        } else {
          return undefined;
        }
      }
    };

    $scope.diff = function(competitor, opponent) {
      return $scope.result(competitor, opponent) - $scope.result(opponent, competitor);
    };

    $scope.hasResult = function(competitor, opponent) {
      return _.isNumber($scope.result(competitor, opponent)) && _.isNumber($scope.result(opponent, competitor));
    };

    $scope.league = league.data;
    setCompetition(competition.data);

    $scope.save = function() {
      $http.put('/api/competitions/' + $scope.competition._id, $scope.competition).success(function(competition) {
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

    $scope.editResult = function(competitor, opponent) {
      var modalInstance = $modal.open({
        templateUrl: 'app/showCompetition/editResult.html',
        controller: 'EditResultCtrl',
        size: 'lg',
        resolve: {
          entry: function() {
            return {
              competitor: competitor,
              opponent: opponent,
              competitorName: $scope.league.competitors[competitor],
              opponentName: $scope.league.competitors[opponent],
              plus: $scope.result(competitor, opponent),
              minus: $scope.result(opponent, competitor)
            };
          }
        }
      });

      modalInstance.result.then(function(entry) {
        $scope.result(entry.competitor, entry.opponent, entry.plus);
        $scope.result(entry.opponent, entry.competitor, entry.minus);
      });
    };

    $scope.me = Auth.getCurrentUser();

    $scope.confirm = function() {
      $http.post('/api/competitions/' + $scope.competition._id + '/actions', { action: 'confirm' }).success(function() {
        $location.path('/leagues/' + $scope.competition.league.id);
      });
    };
  });
