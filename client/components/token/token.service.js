'use strict';

angular.module('instaleagueApp').factory('tokenStore', function ($localStorage, $cookieStore) {

  var put = function(token) {
    $localStorage.token = token;
    $cookieStore.put('token', token);
  };

  var get = function() {
    var token = $localStorage.token;
    if (!token) {
      token = $cookieStore.get('token');
      if (token) {
        put(token);
      }
    }
    return token;
  };

  var remove = function() {
    delete $localStorage.token;
    $cookieStore.remove('token');
  };

  return {
    get: get,
    put: put,
    remove: remove
  };

});
