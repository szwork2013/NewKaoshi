libraryModule
.factory('LibraryServ',['$state','GetDataServ','CommFunServ',
function($state,GetDataServ,CommFunServ){
	var serverdata={
		paperlist:[]
	}
	var server={
		GetServerData:GetServerData,
		InitData:InitData,
		GoExamType:GoExamType,
		GoPaperDetail:GoPaperDetail
	}
	return server;
	function GetServerData(){
		return serverdata;
	}
	function InitData(id){
		GetDataServ.GetPaperData(id).then(function(data){
			serverdata.paperlist=data;
			CommFunServ.RefreshData(serverdata)
		})
	}
	function GoPaperDetail(){
		$state.go('paperDetail');
	}
	function GoExamType(){
		$state.go('examType',{type:1});
	}
}])
