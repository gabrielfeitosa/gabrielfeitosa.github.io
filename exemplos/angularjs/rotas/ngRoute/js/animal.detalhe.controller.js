(function() {
    'use strict';

    angular.module('feira-app')
      .controller('AnimalDetalheController', AnimalDetalheController);

    AnimalDetalheController.$inject = ['$scope', '$routeParams', 'AnimalFactory'];

    function AnimalDetalheController($scope, $routeParams, AnimalFactory) {
      $scope.titulo = 'Detalhe do Animal';
      $scope.animal = AnimalFactory.recuperar($routeParams.id);
    }
})();