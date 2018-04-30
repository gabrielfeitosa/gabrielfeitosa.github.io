(function() {
  'use strict';

  angular.module('app-filters')
    .controller('ExemploController', function($scope, $filter,currencyFilter) {
      $scope.moedaFormatada = $filter('currency')(123456789);
      $scope.moedaFormatada2 = currencyFilter(123456789);
      $scope.dataFormatada = $filter('date')('1984-12-15T00:00','medium');
    });

})();