accountModule
.factory('AccountServ',['$state', 'DataServ', 'CommFunServ', 'LibraryServ','$q',
function($state,DataServ,CommFunServ,LibraryServ,$q){
	var serverdata={
		userInfo:null,
		isLogin:false,
		downlist:null,//我的下载
		lastlist:null,//最近练习
		testlist:null//模拟考试
	}
	var server={
		GetServerData:GetServerData,
		InitData:InitData,
		GoLogin:GoLogin,
		ChangeTest:ChangeTest,
		GoDetail:GoDetail,
		UpdatePsd:UpdatePsd,//修改密码
		UpdateVip:UpdateVip//注册vip
	}
	return server;
	function GetServerData(){
		return serverdata;
	}
	function InitData(){
		serverdata.userinfo=JSON.parse(localStorage.getItem("userInfo"));
		if(serverdata.userinfo){
			serverdata.isLogin=true;
		}
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
	function UpdatePsd(oldpsd,newpsd,confpsd){
		var q=$q.defer();
		if(!oldpsd || !newpsd || !confpsd){
			CommFunServ.ShowAlert("提示","请填写完整!");
			q.reject();
			return q.promise;
		}
		if(newpsd!=confpsd){
			CommFunServ.ShowAlert("提示","新密码与确认密码不符!");
			q.reject();
			return q.promise;
		}
		DataServ.PostUpdatePsd(oldpsd,newpsd).then(function(data){
			CommFunServ.ShowAlert("提示","密码修改成功!")
			q.resolve();
		},function(err){
			CommFunServ.ShowAlert("提示",err)
			q.reject();
		})
		return q.promise;
	}
	function UpdateVip(num,connum){
		var q=$q.defer();
		if(!num || !connum){
			CommFunServ.ShowAlert("提示","请填写完整!");
			q.reject();
			return q.promise;
		}
		DataServ.PostUpdateVip(num).then(function(data){
			CommFunServ.ShowAlert("提示","成功成为vip!")
			q.resolve();
		},function(err){
			CommFunServ.ShowAlert("提示",err)
			q.reject();
		})
		return q.promise;
	}
}])
