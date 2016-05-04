commModule
.factory('SaveDataServ',['$http','$q','SqliteServ',
function($http,$q,SqliteServ){
	var server={
		SyncData:SyncData,
		SyncPaperData:SyncPaperData,
		SyncHistoryData:SyncHistoryData
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
			var len=data.length;
			for(var i=0;i<len;i++){
				SqliteServ.insert(tx, ['ID',"PaperID", "UserID", "Time", "Soure", "Content","Type","IsSync"],[data[i].ID,data[i].PaperID,data[i].UserID,data[i].Time,data[i].Soure,data[i].Content,data[i].Type,data[i].IsSync]);
			}
		})
	}
}])