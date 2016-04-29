commModule
.factory('SaveDataServ',['$http','$q','$rootScope',function($http,$q,$rootScope){
	var server={
		SyncData:SyncData,
		SyncPaperData:SyncPaperData
	}
	return server;
	function SyncData(data){
		$rootScope.dbbase.OpenTransaction(function(tx){
			$rootScope.dbbase.SaveOrUpdateTable();
		})
	}
	function SyncPaperData(data){
		$rootScope.dbbase.OpenTransaction(function(tx){
			$rootScope.dbbase.SaveOrUpdateTable();
		})
	}
	//保存历史记录
	function SyncHistoryData(data){
		$rootScope.dbbase.OpenTransaction(function(tx){
			$rootScope.dbbase.SaveOrUpdateTable();
		})
	}
}])