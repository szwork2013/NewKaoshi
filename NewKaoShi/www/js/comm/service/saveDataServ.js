commModule
.factory('SaveDataServ',['$http','$q','SqliteServ',
function($http,$q,SqliteServ){
	var server={
		SyncData:SyncData,
		SyncPaperData:SyncPaperData
	}
	return server;
	function SyncData(data){
		SqliteServ.transaction(function(tx){
			SqliteServ.insert();
		})
	}
	function SyncPaperData(data){
		SqliteServ.transaction(function(tx){
			SqliteServ.insert();
		})
	}
	//保存历史记录
	function SyncHistoryData(data){
		SqliteServ.transaction(function(tx){
			SqliteServ.insert();
		})
	}
}])