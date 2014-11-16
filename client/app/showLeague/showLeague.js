'use strict';

angular.module('instaleagueApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('showLeague', {
        url: '/{league}',
        templateUrl: 'app/showLeague/showLeague.html',
        controller: 'ShowLeagueCtrl'
      });
  });