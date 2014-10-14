'use strict';

angular.module('instaleagueApp').controller('EditResultCtrl', function ($scope, $modalInstance, entry) {

  $scope.entry = entry;

  $scope.ok = function () {
    $modalInstance.close($scope.entry);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});
