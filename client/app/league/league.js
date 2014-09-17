'use strict';

angular.module('instaleagueApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('league', {
        url: '/leagues/{leagueId}',
        templateUrl: 'app/league/league.html',
        controller: 'LeagueCtrl'
      });
  });
