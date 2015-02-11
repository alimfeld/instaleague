'use strict';

angular.module('instaleagueApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('dashboard', {
        url: '/dashboard',
        templateUrl: 'app/dashboard/dashboard.html',
        controller: 'DashboardCtrl',
        authenticate: true,
        resolve: {
          leagues: function($http) {
            return $http.get('/api/leagues/mine');
          },
          competitions: function($http) {
            return $http.get('/api/competitions/mine');
          }
        }
      });
  });
