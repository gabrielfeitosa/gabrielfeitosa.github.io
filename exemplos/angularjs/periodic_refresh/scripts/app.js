(function() {

  angular.module("app", ["luegg.directives", "app.focus"]);

  angular.module("app")
    .controller("ChatController", function($scope, ChatFactory) {
      $scope.chat = ChatFactory;
      $scope.usuario = {
        nome: ""
      };
    });
})();
