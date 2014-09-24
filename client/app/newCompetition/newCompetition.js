'use strict';

angular.module('instaleagueApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('newCompetition', {
        url: '/{league}/newCompetition',
        templateUrl: 'app/newCompetition/newCompetition.html',
        controller: 'NewcompetitionCtrl',
        authenticate: true
      });
  });
