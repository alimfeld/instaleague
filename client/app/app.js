'use strict';

angular.module('instaleagueApp', [
  'ngCookies',
  'ngStorage',
  'ngResource',
  'ngSanitize',
  'btford.socket-io',
  'ui.router',
  'ui.bootstrap',
  'n3-line-chart'
])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('authInterceptor');
  })

  .constant('_', window._)

  .factory('authInterceptor', function ($rootScope, $q, $location, tokenStore) {
    return {
      // Add authorization token to headers
      request: function (config) {
        config.headers = config.headers || {};
        var token = tokenStore.get();
        if (token) {
          config.headers.Authorization = 'Bearer ' + token;
        }
        return config;
      },

      // Intercept 401s and redirect you to login
      responseError: function(response) {
        if(response.status === 401) {
          $location.path('/login');
          // remove any stale tokens
          tokenStore.remove();
          return $q.reject(response);
        }
        else {
          return $q.reject(response);
        }
      }
    };
  })

  .run(function ($rootScope, $location, Auth) {
    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$stateChangeStart', function (event, next) {
      Auth.isLoggedInAsync(function(loggedIn) {
        if (next.authenticate && !loggedIn) {
          $location.path('/login');
        }
      });
    });
  });
