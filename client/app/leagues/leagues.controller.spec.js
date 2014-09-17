'use strict';

describe('Controller: LeaguesCtrl', function () {

  // load the controller's module
  beforeEach(module('instaleagueApp'));

  var LeaguesCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    LeaguesCtrl = $controller('LeaguesCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
