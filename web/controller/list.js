app.register.controller('list',function($scope, $rootScope, $routeParams) {
    var list = {
        1:[1],
        2:[1,2],
        3:[1,2,3],
        4:[1,2,3,4],
        5:[1,2,3,4,5],
        6:[1,2,3,4,5,6]
    };
    $scope.id = $routeParams.id;
    $scope.list = list[$scope.id];
});