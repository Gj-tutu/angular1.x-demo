app.register.service('getData',function($http,$rootScope){
    var self = this;
    var baseUrl = 'http://www.xxx.com/';
    this.RESULT_OK = 1;
    this.RESULT_ERROR = 0;

    this.getData = function(url,callBack){
        start('getData');
        $http.get(baseUrl+url).success(function(data,header,config,status){
            end(data,callBack);
        }).error(function(data,header,config,status){
            end("",callBack);
        });
    };

    function start(msg){
        log(msg);
        $rootScope.$broadcast('loadingStart');
    }

    function end(data,callBack){
        log('getEnd');
        if(data.code == 0){
            callBack(self.RESULT_OK,data);
        }else{
            if(data.msg) alert(data.msg);
            callBack(self.RESULT_ERROR,data);
        }
        $rootScope.$broadcast('loadingEndNoApply');
    }
});