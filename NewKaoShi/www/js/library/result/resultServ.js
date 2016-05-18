libraryModule
	.factory('ResultServ', ['$rootScope', 'CommFunServ', '$state', 'DataServ','PaperDetailServ',
		function($rootScope, CommFunServ, $state, DataServ,PaperDetailServ) {
			var list = ['A', 'B', 'C', 'D', 'E', 'F', 'G'] //选项
			var serverdata = {
				answerlist: null, //已填答案
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
				DataServ.GetHistoy($rootScope.currentpaper.paperID, 0).then(function(data) {
					if (data && data.length > 0) {
						//存在历史
						serverdata.answerlist = eval("(" + data[0].Content + ")");
					} else {
						serverdata.answerlist = [];
					}
					GetResult();
					ShowTime();
				})
			}
			//计算结果
			function GetResult() {
				var score = 0;
				var len = $rootScope.currentpaper.questionlist.length;
				var length = serverdata.answerlist.length;
				for (var i = 0; i < len; i++) {
					for (var j = 0; j < length; j++) {
						$rootScope.currentpaper.questionlist[i].isRight = 0;
						if ($rootScope.currentpaper.questionlist[i].id == serverdata.answerlist[j].id) {
							score += parseInt(GetScore($rootScope.currentpaper.questionlist[i], serverdata.answerlist[j].answer));
							continue;
						}
					}
				}
				serverdata.score = score;
				serverdata.wrongcount = parseInt($rootScope.currentpaper.itemNum) - parseInt(serverdata.rightcount);
				var str = "";
				var passmark = $rootScope.currentpaper.passMark;
				var total = parseInt($rootScope.currentpaper.totalScore) - 20;
				if (serverdata.score < passmark) {
					str = "没有及格，请再接再厉！"
				} else if (serverdata.score > passmark && serverdata.score < total) {
					str = "恭喜你考试通过！"
				} else {
					str = "成绩优秀，请继续保持！"
				}
				serverdata.rate = Math.floor(100 * parseInt(serverdata.rightcount) / parseInt($rootScope.currentpaper.itemNum));
				serverdata.scoretext = str;
				CommFunServ.RefreshData(serverdata);
			}
			//计算单选多选分数
			function GetScore(item, answer) {
				var rightarr = item.answer.split(""); //正确答案
				var answerarr = answer.split("|");; //回答答案
				if (rightarr.length != answerarr.length) {
					item.isRight = 0;
					return 0; //选多或选少不得分
				}
				if (answerarr && answerarr.length > 0) {
					var len = answerarr.length;
					var count = 0; //匹配个数
					switch (item.questionType) {
						case 'checking':
							if (rightarr[0] == "对" && answerarr[0]=="0") {
								count++;
							} else if (rightarr[0] == "错" && answerarr[0]=="1") {
								count++;
							}
							break;
						case 'singleChoice':
						case 'mutepliChoice':
							for (var i = 0; i < len; i++) {
								for (var j = 0; j < len; j++) {
									if (list[answerarr[i]] == rightarr[j]) {
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
					item.isRight = 1;
					return item.soure;
				} else {
					item.isRight = 0;
					return 0;
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
				$state.go('resultCard');
			}

			function GoPaperDeatail() {
				Destory();
				$state.go('paperDetail');
			}

			function TestAgain() {
				Destory();
				//提示是否重新考试
				PaperDetailServ.Start(0);
				//删除历史数据
				DataServ.DeletKaoshiHis($rootScope.currentpaper.paperID).then(function(data){
					$state.go('kaoshi',{
						history:false
					});
				});
				
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