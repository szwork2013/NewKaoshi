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
		var len=$rootScope.currentpaper.questionlist.length;
		for(var i=0;i<len;i++){
			if($rootScope.currentpaper.questionlist[i].hasdo){
				switch($rootScope.currentpaper.questionlist[i].QuestionType){
					case 0://单选
					case 1://多选
						score+=JparseInt(iSuanChoiceScore($rootScope.currentpaper.questionlist[i]));
					break;
					case 2://简答
						var code=$rootScope.currentpaper.questionlist[i].answer;
						score+=parseInt(code);
						if(code!=0){
							$rootScope.currentpaper.questionlist[i].isRight=1;//0错误，1正确，2没有回答
							serverdata.rightcount++;
						}
					break;
				}
			}else{
				$rootScope.currentpaper.questionlist[i].isRight=0;
			}
		}
		serverdata.score=score;
		CommFunServ.RefreshData(serverdata);
	}
	//计算单选多选分数
	function JiSuanChoiceScore(item){
		var score=0;
		var rightarr=item.Answer.split("|");//正确答案
		var answerarr=item.answer;//回答答案
		if(rightarr.length!=answerarr.length){
			item.isRight=0;
			return 0;//选多或选少不得分
		}
		var len=answerarr.length;
		var count=0;//匹配个数
		for(var i=0;i<len;i++){
			for(var j=0;j<len;j++){
				if(answerarr[i]==rightarr[j]){
					count++;
					continue;
				}
			}
		}
		if(count==len){
			serverdata.rightcount++;
			item.isRight=1;
			return item.Soure;
		}else{
			item.isRight=0;
			return 0;
		}
		return 0;
	}
	
}])