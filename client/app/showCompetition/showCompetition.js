'use strict';

angular.module('instaleagueApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('showCompetition', {
        url: '/leagues/{league}/competitions/{competition}',
        templateUrl: 'app/showCompetition/showCompetition.html',
        controller: 'ShowCompetitionCtrl',
        resolve: {
          league: function($http, $stateParams) {
            return $http.get('/api/leagues/' + $stateParams.league);
          },
          competition: function($http, $stateParams) {
            return $http.get('/api/competitions/' + $stateParams.competition);
          }
        }
      });
  });
