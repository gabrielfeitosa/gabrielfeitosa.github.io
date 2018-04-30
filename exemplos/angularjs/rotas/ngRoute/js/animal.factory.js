(function() {
  'use strict';

  angular.module('feira-app')
    .factory('AnimalFactory', AnimalFactory);

  function AnimalFactory() {
    var animais = [{
      "id": 0,
      "nome": "Xilito",
      "raca": "ViraLata",
      "idade": 5
    }, {
      "id": 1,
      "nome": "Chiquinha",
      "raca": "Poodle",
      "idade": 1
    }];

    return {
      recuperar: get,
      listar: list
    };

    function get(id) {
      return animais[id];
    }

    function list() {
      return animais;
    }
  }

})();