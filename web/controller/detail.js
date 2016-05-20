app.register.controller('detail',['$scope', '$rootScope', '$routeParams', 'detail-text',function($scope, $rootScope, $routeParams, content) {
    $scope.id = $routeParams.id;
    $scope.listId = $routeParams.listId;
    $scope.inputText = "";
    $scope.list = content.getList($scope.listId,$scope.id);
    log($scope.list);
    log($rootScope.list);
    $scope.add = function(){
        var id = $scope.list.length -1;
        $scope.list.push({id:id,text:$scope.inputText});
        $scope.inputText = "";
    };
    $scope.del = function(id){
        $scope.list.splice(id, 1);
    };
}]);