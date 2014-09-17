'use strict';

angular.module('instaleagueApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('leagues', {
        url: '/leagues',
        templateUrl: 'app/leagues/leagues.html',
        controller: 'LeaguesCtrl',
        authenticate: true
      });
  });
