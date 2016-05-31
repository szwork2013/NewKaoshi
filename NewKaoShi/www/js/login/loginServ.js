loginModule
.factory('LoginServ',['DataServ',
function(DataServ){
	var server={
		InitAppData:InitAppData
	}
	return server;
	function InitAppData(){
		DataServ.InitDataBase();
		DataServ.PostExamTypes()
	}
}])