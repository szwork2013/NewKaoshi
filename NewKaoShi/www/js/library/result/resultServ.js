libraryModule
.factory('ResultServ',['$rootScope','CommFunServ','$state',
function($rootScope,CommFunServ,$state){
	var serverdata={
		score:0,//获得分数
		scoretext:'',//分数描述
		rightcount:0,//答对题数
		wrongcount:0,//打错题数
		rate:0,//正确率
		time:0//考试已用时间
	}
	var server={
		GetServerdata:GetServerdata,
		InitData:InitData
	}
	return server;
	function GetServerdata(){
		return serverdata;
	}
	//初始化数据
	function InitData(){
		GetResult();
		ShowTime();
	}
	//计算结果
	function GetResult(){
		var score=0;
		var len=$rootScope.currentpaper.questionlist.length;
		for(var i=0;i<len;i++){
			if($rootScope.currentpaper.questionlist[i].hasdo){
				switch($rootScope.currentpaper.questionlist[i].QuestionType){
					case 0://单选
					case 1://多选
						score+=parseInt(GetScore($rootScope.currentpaper.questionlist[i]));
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
		serverdata.wrongcount=parseInt($rootScope.currentpaper.itemNum)-parseInt(serverdata.rightcount);
		var str="";
		var passmark=$rootScope.currentpaper.passMark;
		var total=parseInt($rootScope.currentpaper.totalScore)-20;
		if(serverdata.score<passmark){
			str="没有及格，请再接再厉！"
		}else if(serverdata.score>passmark && serverdata.score<total){
			str="恭喜你考试通过！"
		}else{
			str="成绩优秀，请继续保持！"
		}
		serverdata.rate=100*parseInt(serverdata.rightcount)/parseInt($rootScope.currentpaper.itemNum);
		serverdata.scoretext=str;
		CommFunServ.RefreshData(serverdata);
	}
	//计算单选多选分数
	function GetScore(item){
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
	//拼凑考试已用时间
	function ShowTime() {
		var time=$rootScope.currentpaper.rtime;
		var hour = parseInt(time / 3600);
		var minute = parseInt(time % 3600 / 60);
		var second = time % 60;
		var str="";
		if(hour>0){
			str =hour+"小时"
		}
		if(minute>0){
			str=str+minute+"分钟"
		}
		str=str+second+"秒";
		serverdata.time=str;
		CommFunServ.RefreshData(serverdata);
	}
	
}])