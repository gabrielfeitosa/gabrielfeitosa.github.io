(function() {
  'use strict';

  angular.module('feira-app')
    .config(function($routeProvider) {
      $routeProvider
        .when('/animais', {
          templateUrl: 'lista.html',
          controller: 'AnimalListaController'
        })
        .when('/animais/:id', {
          templateUrl: 'detalhe.html',
          controller: 'AnimalDetalheController'
        }).otherwise({
          redirectTo: '/animais'
        });
    });
})();