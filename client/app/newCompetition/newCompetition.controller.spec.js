'use strict';

describe('Controller: NewcompetitionCtrl', function () {

  // load the controller's module
  beforeEach(module('instaleagueApp'));

  var NewcompetitionCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    NewcompetitionCtrl = $controller('NewcompetitionCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
