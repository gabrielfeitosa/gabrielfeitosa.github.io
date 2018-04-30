(function() {

	angular.module("app.focus",[]);

    angular.module("app.focus")
        .factory('focus', function($timeout, $window) {
            return function(id) {
                $timeout(function() {
                    var element = $window.document.getElementById(id);
                    if (element)
                        element.focus();
                });
            };
        })

    angular.module("app.focus")
        .directive('eventFocus', function(focus) {
            return function(scope, elem, attr) {
                elem.on(attr.eventFocus, function() {
                    focus(attr.eventFocusId);
                });
                scope.$on('$destroy', function() {
                    elem.off(attr.eventFocus);
                });
            };
        });
})();