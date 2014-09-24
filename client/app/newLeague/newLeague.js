'use strict';

angular.module('instaleagueApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('newLeague', {
        url: '/newLeague',
        templateUrl: 'app/newLeague/newLeague.html',
        controller: 'NewleagueCtrl',
        authenticate: true
      });
  });
