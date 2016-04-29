commModule
	.factory('CommFunServ', ['$timeout',function($timeout) {
		var server={
			RefreshData:RefreshData
		}
		return server;
		//刷新界面数据
		function RefreshData(data){
			$timeout(function(){
				data=data;
			},0)
		}
	}])