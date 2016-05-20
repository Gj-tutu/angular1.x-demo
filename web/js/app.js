var app = angular.module('app',['ngRoute'])

app.debug = true;

function log(log){
    if(app.debug){
        console.log(log);
    }
}

app.config(['$controllerProvider', '$compileProvider', '$filterProvider', '$provide', '$routeProvider', '$locationProvider',
    function($controllerProvider, $compileProvider, $filterProvider, $provide, $routeProvider, $locationProvider) {
    app.register = {
        controller: $controllerProvider.register,
        directive: $compileProvider.directive,
        filter: $filterProvider.register,
        factory: $provide.factory,
        service: $provide.service
    };
    app.asyncJs = function (js) {
        return ["$q", "$rootScope", function ($q,$rootScope) {
            var deferred = $q.defer();
            $script(js, function () {
                $rootScope.$apply(function () {
                    deferred.resolve();
                });
            });
            return deferred.promise;
        }];
    };
    $routeProvider
        .when('/index', {
            templateUrl: 'tpl/index.html',
            resolve: {
                load: app.asyncJs('controller/index.js')
            }
        })
        .when('/list/:id', {
            templateUrl: 'tpl/list.html',
            resolve: {
                load: app.asyncJs('controller/list.js')
            }
        })
        .when('/detail/:listId/:id', {
            templateUrl: 'tpl/detail.html',
            resolve: {
                load: app.asyncJs(['service/detail-text.js','controller/detail.js','js/vendor/fastclick.js','directive/gclick.js'])
            }
        })
        .otherwise({
            redirectTo: '/index'
        });

        $locationProvider.html5Mode(true);
}]);

app.controller('header',['$scope','$rootScope','$location',function($scope,$rootScope,$location) {

    $scope.title = "xx";
    $scope.show = true;
    $scope.backAction = null;
    $scope.backUrl = null;
    $scope.currUrl = null;
    $scope.lastUrl = [];

    $scope.back = function(){
        console.log("back");
        if($scope.backAction != null){
            $scope.backAction();
        }else{
            if($scope.lastUrl.pop() == $scope.backUrl){
                window.history.back();
            }else{
                replace($scope.backUrl);
            }
        }
    };

    $scope.$on('$routeChangeStart',function(){
        log("saveLocation");
        $scope.lastUrl.push($scope.currUrl);
        $scope.currUrl = $location.path();
    });

    $scope.$on('routeBack',function(){
        $scope.back();
    });

    $scope.$on('routeChange',function(event,history,url){
        if(history){
            $location.path(url);
        }else{
            replace(url);
        }
    });

    $scope.$on('headerChange',function(event,header){
        log('headerChange');
        $scope.title = header.title ? header.title : null;
        $scope.backAction = header.back ? header.back : null;
        $scope.backUrl = header.backUrl ? header.backUrl : null;
    });

    function replace(url){
        if(!url) return;
        try{
            window.history.replaceState(null,null,'#'+url);
        }catch(E){
            $location.path(url);
        }
    }
}]);

app.controller('loading',['$scope', function($scope) {
    $scope.show = false;

    $scope.showNum = 0;

    $scope.setShow = function(){
        log('loadingShow');
        setChange(1);
    };

    $scope.setHide = function(){
        log('loadingHide');
        setChange(-1);
    };

    $scope.$on('$routeChangeStart',function(){
        if($scope.showNum > 0){
            window.location.reload();
        }
        $scope.setShow();
    });

    $scope.$on('$routeChangeSuccess',function(){
        $scope.setHide();
    });

    $scope.$on('loadingStart',function(){
        $scope.setShow();
    });

    $scope.$on('loadingEnd',function(){
        $scope.setHide();
        $scope.$apply();
    });
    $scope.$on('loadingEndNoApply',function(){
        $scope.setHide();
    });

    function setChange(num){
        $scope.showNum = $scope.showNum + num;
        if($scope.showNum == 0){
            $scope.show = false;
        }else{
            $scope.show = true;
        }
    }
}]);

app.service('browserInfo',function(){

    var self = this;
    this.isWeiXin = false;
    this.isIe = false;
    this.isChrome = false;
    this.isSafari = false;
    this.isSelfApp = false;
    this.isFirefox = false;
    this.isOpera = false;
    this.isInit = false;
    this.getInfo = function(){
        if(!self.isInit){
            init();
        }
        return self;
    };

    function init(){
        var agent = navigator.userAgent.toLowerCase();
        if(agent.indexOf("msie") > 0){
            self.isIe = true;
        }

        if(agent.indexOf("firefox") > 0){
            self.isFirefox = true;
        }

        if(agent.indexOf("chrome") > 0){
            self.isChrome = true;
        }

        if(agent.indexOf("safari") > 0 && agent.indexOf("chrome") < 0){
            self.isSafari = true;
        }

        if(agent.indexOf("selfapp") > 0){
            self.isSelfApp = true;
        }

        if(agent.indexOf("opera") > 0){
            self.isOpera = true;
        }

        if(agent.indexOf("MicroMessenger") > 0){
            self.isWeiXin = true;
        }
        self.isInit = true;
    }
});