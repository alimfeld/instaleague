'use strict';

angular.module('instaleagueApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('main', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl',
        authenticate: true,
        resolve: {
          leagues: function($http) {
            return $http.get('/api/leagues');
          },
          competitions: function($http) {
            return $http.get('/api/competitions');
          }
        }
      });
  });