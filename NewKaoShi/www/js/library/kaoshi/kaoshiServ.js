libraryModule
	.factory('KaoshiServ', ['$timeout', '$rootScope', 'GetDataServ', 'CommFunServ', '$ionicSlideBoxDelegate',
		function($timeout, $rootScope, GetDataServ, CommFunServ, $ionicSlideBoxDelegate) {
			var timeCount; //秒
			var timer; //setTimeout方法 
			var serverdata = {
				title:'',//题型
				rtime: 0, //考试时间
				questionlist: [], //考试试题
				isUpload: false, //是否交卷
				answerContent: [] //试卷所有试题答案

			}
			var server = {
				GetServerData: GetServerData,
				slideHasChanged:slideHasChanged,
				GeTQuestionList: GeTQuestionList,
				SelectAnswer: SelectAnswer,
				LastTest:LastTest,
				NextTest:NextTest
				
			}
			return server;

			function GetServerData() {
				return serverdata;
			}
			//获取试卷试题
			function GeTQuestionList(bool) {
				if ($rootScope.currentPaper) {
					if ($rootScope.currentPaper.IsDownload == 0) {
						//试卷未下载，请求下载试题
					} else {
						//获取试卷所有试题并合并
						GetDataServ.GetPaperQuestionData($rootScope.currentPaper.PaperID).then(function(data) {
							if (data && data.length > 0) {
								/*var str="[{key:'A',value:'你很好'},{key:'B',value:'说的话说好的'},{key:'C',value:'阿斯顿撒旦'},{key:'D',value:'佛挡杀佛'}]"
								var json=eval("("+str+")"); */
								var len = data.length;
								for (var i = 0; i < len; i++) {
									data[i].OptionContent = eval("(" + data[i].OptionContent + ")");
								}
								serverdata.questionlist = data;
								slideHasChanged(0);
								$ionicSlideBoxDelegate.update();
								CommFunServ.RefreshData(serverdata);
								//type=0表示历史考试
								if (bool) {
									GetHistory(data);
								}
							}
						})
					}
				}
			}
			//获取历史
			function GetHistory(datalist) {
				GetDataServ.GetHistoyPaper($rootScope.currentPaper.PaperID, 0).then(function(data) {
					if (data && data.length > 0) {
						//存在历史
						serverdata.answerContent = data[0].Content;
						AssmbleList();
					}
				})
			}
			//组装历史记录
			function AssmbleList() {
				var len = serverdata.answerContent.length;
				for (var i = 0; i < len; i++) {
					var length = serverdata.questionlist.length;
					for (var j = 0; j < length; j++) {
						if (serverdata.answerContent[i].id == serverdata.questionlist[j].ID) {
							//"1|3"多选答案
							if (serverdata.questionlist[j].QuestionType != 2) {
								//单选0，多选1
								var arr = serverdata.answerContent[i].answer.split("|");
								var lenk = arr.length;
								var list = new Array(serverdata.questionlist[j].OptionContent.length);
								for (var k = 0; k < lenk; k++) {
									list[arr[k]] = true;
								}
								serverdata.questionlist[j].answer = list;
							}
							break;
						}
					}
				}
			}
			//切换试题类型
			function slideHasChanged(index){
				var item=serverdata.questionlist[index];
				switch(item.QuestionType){
					case '0':
					serverdata.title="单选题";
					break;
					case '1':
					serverdata.title="多选题";
					break;
					case '2':
					serverdata.title="案例题";
					break;
					default:
					serverdata.title="";
					break;
				}
				CommFunServ.RefreshData(serverdata);
			}
			//单选
			function SelectAnswer(parentindex, index) {
				var item = serverdata.questionlist[parentindex];
				if(serverdata.questionlist[parentindex].answer==null || item.QuestionType==0){
					serverdata.questionlist[parentindex].answer=CommFunServ.InitArray(item.OptionContent.length,false)
				}
				serverdata.questionlist[parentindex].answer[index] = !serverdata.questionlist[parentindex].answer[index];

				var str = "";
				var len = serverdata.questionlist[parentindex].answer.length;
				for (var i = 0; i < len; i++) {
					if (serverdata.questionlist[parentindex].answer[i]) {
						str = str + '|' + i;
					}
				}
				//答案是否存在，修改答案
				var length = serverdata.answerContent.length;
				for(var j = 0; j < length; j++) {
						if (serverdata.answerContent[j].id == item.ID) {
							serverdata.answerContent[j].answer = str;
							CommFunServ.RefreshData(serverdata);
							if (item.QuestionType == 0) { //单选
								NextTest();
							}
							return;
						}
					}
					//添加答案
				var answeritem = {
					id: item.ID,
					answer: str
				}
				serverdata.answerContent.push(answeritem);
				CommFunServ.RefreshData(serverdata);
				if (item.QuestionType == 0) { //单选
					NextTest();
				}
			}
			//上一题
			function LastTest() {
				if ($ionicSlideBoxDelegate.currentIndex() <= 0) {
					//已到最前题
					return;
				}
				$ionicSlideBoxDelegate.previous();
			}
			//下一题
			function NextTest() {
				var length = serverdata.questionlist.length - 1;
				if ($ionicSlideBoxDelegate.currentIndex() >= length) {
					//已到最后题
					return;
				}
				$ionicSlideBoxDelegate.next();
				//记录历史(未完成)
			}
			//初始化考试时间秒、分、小时
			function InitTime(sec) {
				timeCount = sec;
				StartTime();
			}
			//开始及时
			function StartTime() {
				t = $timeout(function() {
					time++;
					ShowTime(time);
				}, 1000); //每隔1秒（1000毫秒）递归调用一次
			}
			//停止考试
			function StopTime() {
				if (t) {
					$timeout.cancel(t);
					t = null;
				}
			}
			//显示时间
			function ShowTime(time) {
				var hour = time / 3600;
				var minute = time % 3600 / 60;
				var second = time % 60;
				var str = AssmbleTime(hour) + ":" + AssmbleTime(minute) + ":" + AssmbleTime(second);
			}
			//显示数字填补，即当显示的值为0-9时
			function AssmbleTime(arg) {
				return arg >= 10 ? arg : "0" + arg;
			}
		}
	])