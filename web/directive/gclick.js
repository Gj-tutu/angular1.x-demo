app.register.directive('gclick',function(){
    return{
        restrict:'A',//A: Ù–‘,E:±Í«©,C:class,M:◊¢ Õ
        link:function($scope,element,attrs){
            element.bind('click',function(){
                var scope = $scope.$parent;
                eval("scope."+attrs.gclick);
                $scope.$apply();
            });
        }
    }
});
