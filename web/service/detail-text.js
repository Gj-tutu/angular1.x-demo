app.register.service('detail-text',function($rootScope) {
	this.getList = function(listId,detailId){
		var list;
		var id = getId(listId,detailId);
		if(!$rootScope.list){
			$rootScope.list = [];
		}

		if(!$rootScope.list[id]){
			$rootScope.list[id] = [];
		}

		list = $rootScope.list[id];

		return list;
	}

	function getId(listId,id){
		return ''+listId+id;
	}
});