commModule
.factory('PostServ',['$http','$q','SaveDataServ',function($http,$q,SaveDataServ){
	
	var server={
		
	}
	return server;
	function PostData(url,parma){
		var q=$q.defer();
		$http({
				method: 'POST',
				url: url,
				params: parma,
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded:charset=utf-8'
					}
			}).success(function(response) {
				q.resolve(response);
			});
			return q.promise;
	}
	//登陆
	function Login(parma){
		PostData().then(function(data){
			
		})
	}
	//注册
	function Resiste(){
		PostData().then(function(data){
			//提示注册成功，是否需要直接发送登陆请求还是后台直接处理
		})
	}
	
	//无参数，数据包含：考试类型、试卷信息
	function SyncAllData(){
		PostData().then(function(data){
			SaveDataServ.SyncData(data);
		})
	}
	//同步试题，试卷id
	function SyncPaperData(id){
		PostData().then(function(data){
			SaveDataServ.SyncPaperData(data);
		})
	}
	//只在第一次登陆后同步历史记录
	function SyncHistoryData(){
		PostData().then(function(data){
			SaveDataServ.SyncPaperData(data);
		})
	}
	//上传历史数据
	function UploadHistoryData(){
		PostData().then(function(data){
			//提示成功
		})
	}
	
}])
