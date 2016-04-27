commModule
.factory('GetDataServ',['$http','$q',function($http,$q){
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
	//无参数
	function SyncTypeData(){
		PostData().then(function(data){
			SqliteServ.insert();
		})
	}
	//试卷id
	function SyncPaperData(id){
		PostData().then(function(data){
			SqliteServ.insert();
		})
	}
	//无参数，获取考试分类
	function GetTypeData(){
		
	}
	//大类型id，获取
	function GetTypeItemData(id){
		
	}
	//小类型id
	function GetQulicationData(id){
		
	}
	//具体资格id，用于获取试卷信息
	function GetPaperDetail(id){
		//需查看历史记录是否有历史
	}
	//试卷id，用于获取试卷具体题目
	function GetKaoshiData(id){
		
	}
	//无参数，用于获取广告图
	function GetHomeData(){
		
	}
	//试题id,用于错题、收藏
	function GetQuestionData(id){
		
	}

	
}])
