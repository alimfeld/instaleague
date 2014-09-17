'use strict';

describe('Controller: LeagueCtrl', function () {

  // load the controller's module
  beforeEach(module('instaleagueApp'));

  var LeagueCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    LeagueCtrl = $controller('LeagueCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
