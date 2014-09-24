'use strict';

describe('Controller: NewleagueCtrl', function () {

  // load the controller's module
  beforeEach(module('instaleagueApp'));

  var NewleagueCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    NewleagueCtrl = $controller('NewleagueCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
