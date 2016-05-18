libraryModule
.factory("ResultCardServ",["DataServ",'$rootScope'
function(DataServ,$rootScope){
	var serverdata={
		
	}
	var server={
		GetServerdata:GetServerdata
	}
	return server;
	function GetServerdata(){
		return server;
	}
	//初始化数据
	function InitData(){
		DataServ.GetHistoy($rootScope.currentpaper.paperID)
	}
}])