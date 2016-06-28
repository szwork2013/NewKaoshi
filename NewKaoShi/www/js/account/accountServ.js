accountModule
.factory('AccountServ',['$state', 'DataServ', 'CommFunServ', 'LibraryServ',
function($state,DataServ,CommFunServ,LibraryServ){
	var serverdata={
		downlist:null,//我的下载
		lastlist:null,//最近练习
		testlist:null//模拟考试
	}
	var server={
		GetServerData:GetServerData,
		InitData:InitData,
		GoLogin:GoLogin,
		ChangeTest:ChangeTest,
		GoDetail:GoDetail
	}
	return server;
	function GetServerData(){
		return serverdata;
	}
	function InitData(){
		DataServ.BaseSelect("select * from tb_Papers where Status=?",["2"]).then(function(data){
			serverdata.downlist=data;
			CommFunServ.RefreshData(serverdata);
		})
		DataServ.BaseSelect("select * from tb_History join tb_Papers on tb_History.PaperID = tb_Papers.PaperID  where tb_History.Type=?",["1"]).then(function(data){
			serverdata.lastlist=data;
			CommFunServ.RefreshData(serverdata);
		})
		DataServ.BaseSelect("select * from tb_History join tb_Papers on tb_History.PaperID = tb_Papers.PaperID  where tb_History.Type=?",["0"]).then(function(data){
			serverdata.testlist=data;
			CommFunServ.RefreshData(serverdata);
		})
		
	}
	function GoLogin(){
			$state.go('login');
	}
	function ChangeTest(){
		$state.go('examType', {
				type: 1
		});
	}
	function GoDetail(paperid){
		LibraryServ.GoPaperDetail(paperid);
	}
}])
