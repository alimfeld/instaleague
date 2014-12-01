'use strict';

angular.module('instaleagueApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('showLeague', {
        url: '/leagues/{league}',
        templateUrl: 'app/showLeague/showLeague.html',
        controller: 'ShowLeagueCtrl',
        resolve: {
          league: function($http, $stateParams) {
            return $http.get('/api/leagues/' + $stateParams.league);
          }
        }
      });
  });