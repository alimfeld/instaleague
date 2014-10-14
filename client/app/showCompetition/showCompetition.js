'use strict';

angular.module('instaleagueApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('competition', {
        url: '/competitions/{competition}',
        templateUrl: 'app/showCompetition/showCompetition.html',
        controller: 'ShowCompetitionCtrl',
        authenticate: true
      });
  });
