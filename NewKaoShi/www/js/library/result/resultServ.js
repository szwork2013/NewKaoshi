libraryModule
.factory('ResultServ',['$rootScope','CommFunServ','$state',
function($rootScope,CommFunServ,$state){
	var serverdata={
		score:0,//获得分数
		scoretext:'',//分数描述
		rightcount:0,//答对题数
		wrongcount:0//打错题数
	}
	var server={
		
	}
	return server;
	function GetServerdata(){
		return serverdata;
	}
	//计算获得分数
	function GetScore(){
		var score=0;
		var len=$rootScope.questionlist.length;
		for(var i=0;i<len;i++){
			if($rootScope.questionlist[i].hasdo){
				
			}
		}
	}
	//计算答对题数
	function GetRightCount(){
		
	}
}])