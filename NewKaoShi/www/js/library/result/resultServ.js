libraryModule
	.factory('ResultServ', ['$rootScope', 'CommFunServ', '$state', 'DataServ','PaperDetailServ',
		function($rootScope, CommFunServ, $state, DataServ,PaperDetailServ) {
			var list = ['A', 'B', 'C', 'D', 'E', 'F', 'G'] //选项
			var serverdata = {
				score: 0, //获得分数
				scoretext: '', //分数描述
				rightcount: 0, //答对题数
				wrongcount: 0, //打错题数
				rate: 0, //正确率
				time: 0 //考试已用时间
			}
			var server = {
				GetServerdata: GetServerdata,
				InitData: InitData,
				CheckAnswer: CheckAnswer,
				GoPaperDeatail: GoPaperDeatail,
				TestAgain: TestAgain
			}
			return server;

			function GetServerdata() {
				return serverdata;
			}
			//初始化数据
			function InitData(type) {
				if($rootScope.currentpaper.answerContent==null){
					DataServ.GetHistoy($rootScope.currentpaper.paperID, 0).then(function(data) {
					if (data && data.length > 0) {
						//存在历史
						$rootScope.currentpaper.answerContent = eval("(" + data[0].Content + ")");
					} else {
						$rootScope.currentpaper.answerContent = [];
					}
					GetResult();
					ShowTime();
				})
				}else{
					GetResult();
					ShowTime();
				}
				
			}
			//计算结果
			function GetResult() {
				$rootScope.currentpaper.score=0;
				var score = 0;
				var len = $rootScope.currentpaper.questionlist.length;
				var length = $rootScope.currentpaper.answerContent.length;
				for (var i = 0; i < len; i++) {
					$rootScope.currentpaper.questionlist[i].isRight = 0;
					for (var j = 0; j < length; j++) {
						if ($rootScope.currentpaper.questionlist[i].id == $rootScope.currentpaper.answerContent[j].id) {
							var paperid=$rootScope.currentpaper.questionlist[i].paperId;
							score += parseInt(GetScore(i, $rootScope.currentpaper.answerContent[j],paperid));
							continue;
						}
					}
				}
				$rootScope.currentpaper.score=score;
				serverdata.wrongcount = parseInt($rootScope.currentpaper.itemNum) - parseInt(serverdata.rightcount);
				var str = "";
				var passmark = $rootScope.currentpaper.passMark;
				var total = parseInt($rootScope.currentpaper.totalScore) - 20;
				if (serverdata.score < passmark) {
					str = "没有及格，请再接再厉！"
				} else if ($rootScope.currentpaper.score > passmark && $rootScope.currentpaper.score < total) {
					str = "恭喜你考试通过！"
				} else {
					str = "成绩优秀，请继续保持！"
				}
				serverdata.rate = Math.floor(100 * parseInt(serverdata.rightcount) / parseInt($rootScope.currentpaper.itemNum));
				serverdata.scoretext = str;
				CommFunServ.RefreshData(serverdata);
			}
			//计算单选多选分数
			function GetScore(index, item,paperid) {
			
			if(item.answer){
				var rightarr = $rootScope.currentpaper.questionlist[index].answer.split(""); //正确答案
				var answerarr = item.answer.split("|");; //回答答案
				if (rightarr.length != answerarr.length) {
					$rootScope.currentpaper.questionlist[index].isRight = 0;
					return 0; //选多或选少不得分
				}
				if (answerarr && answerarr.length > 0) {
					var len = answerarr.length;
					var count = 0; //匹配个数
					switch ($rootScope.currentpaper.questionlist[index].questionType) {
						case 'checking':
							if (rightarr[0] ==answerarr[0]) {
								count++;
							}
							break;
						case 'singleChoice':
						case 'multipleChoice':
							for (var i = 0; i < len; i++) {
								for (var j = 0; j < len; j++) {
									if (answerarr[i] == rightarr[j]) {
										count++;
										continue;
									}
								}
							}
							break;
						case "case":
							var scoe = parseInt(answerarr[0]);
							if (scoe > 0) {
								$rootScope.currentpaper.questionlist[i].isRight = 1; //0错误，1正确，2没有回答
								serverdata.rightcount++;
							}
							return scoe;
							break;
					}
				}
				if (count == len) {
					serverdata.rightcount++;
					$rootScope.currentpaper.questionlist[index].isRight = 1;
					return $rootScope.currentpaper.questionlist[index].soure;
				} else {
					SaveErrorQuestion(paperid,item.id);
					$rootScope.currentpaper.questionlist[index].isRight = 0;
					return 0;
				}
				return 0;
				}else if(item.code){
					serverdata.rightcount++;
					$rootScope.currentpaper.questionlist[index].isRight = 1;
					return item.code;
				}
				return 0;
			}
			//拼凑考试已用时间
			function ShowTime() {
				var time = $rootScope.currentpaper.rtime;
				var hour = parseInt(time / 3600);
				var minute = parseInt(time % 3600 / 60);
				var second = time % 60;
				var str = "";
				if (hour > 0) {
					str = hour + "小时"
				}
				if (minute > 0) {
					str = str + minute + "分"
				}
				str = str + second + "秒";
				serverdata.time = str;
				CommFunServ.RefreshData(serverdata);
			}

			function CheckAnswer() {
				Destory();
				$state.go('resultCard',{
					type:0
				});
			}

			function GoPaperDeatail() {
				Destory();
				$state.go('paperDetail');
			}

			function TestAgain() {
				Destory();
				//提示是否重新考试
				PaperDetailServ.Start(0);
				$rootScope.currentpaper.answerContent=null;
				//删除历史数据
				DataServ.DeletPaperHistory($rootScope.currentpaper.paperID).then(function(data){
					$state.go('kaoshi',{
						history:false
					});
				});
				
			}
			function SaveErrorQuestion(paperid,id){
				var userid=$rootScope.userInfo!=null?$rootScope.userInfo.UserID:"";
				var data=[{
					PaperID:paperid,
					QuestionID:id,
					UserID:userid,
					Type:0,//错题
					IsSync:0//未同步
				}]
				DataServ.SaveErrOrColl(data);
			}

			function Destory() {
				serverdata.score = 0; //获得分数
				serverdata.scoretext = ''; //分数描述
				serverdata.rightcount = 0; //答对题数
				serverdata.wrongcount = 0; //打错题数
				serverdata.rate = 0; //正确率
				serverdata.time = 0; //考试已用时间
				
			}
		}
	])