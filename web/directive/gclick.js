app.register.directive('gclick',function(){
    return{
        restrict:'A',//A:����,E:��ǩ,C:class,M:ע��
        link:function($scope,element,attrs){
            element.bind('click',function(){
                var scope = $scope.$parent;
                eval("scope."+attrs.gclick);
                $scope.$apply();
            });
        }
    }
});
