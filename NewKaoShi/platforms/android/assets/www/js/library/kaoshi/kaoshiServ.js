libraryModule
	.factory('KaoshiServ', ['$timeout', '$rootScope', 'DataServ', 'CommFunServ', '$ionicSlideBoxDelegate', '$state',
		function($timeout, $rootScope, DataServ, CommFunServ, $ionicSlideBoxDelegate, $state) {
			var timeCount; //秒
			var timer; //setTimeout方法 
			var serverdata = {
				isShowTitle: false, //是否显示大题标题
				titleContent: null, //当前大题内容
				title: '', //题型
				isUpload: false, //是否交卷
				questiontitle: '' //题干
			}
			var server = {
				GetServerData: GetServerData,
				slideHasChanged: slideHasChanged, //改变试题
				InitList: InitList, //初始化
				SelectAnswer: SelectAnswer, //选择答案
				Estimate: Estimate,
				LastTest: LastTest, //上一题
				NextTest: NextTest, //下一题
				Back: Back, //返回
				Assignment: Assignment //交卷

			}
			return server;

			function GetServerData() {
				return serverdata;
			}
			//初始化数据
			function InitList(bool) {
				slideHasChanged(0);

				//type=0表示历史考试
				if (bool == 'true') {
					GetHistory();
				} else {
					InitTime(0);
				}
			}
			//获取历史
			function GetHistory() {
				DataServ.GetHistoy($rootScope.currentpaper.paperID, 0).then(function(data) {
					if (data && data.length > 0) {
						//存在历史
						if ($rootScope.currentpaper.answerContent == null) {
							$rootScope.currentpaper.answerContent = new Array();
						}
						$rootScope.currentpaper.answerContent = eval("(" + data[0].Content + ")");
						InitTime(parseInt(data[0].Time));
						AssmbleList();
					}
				})
			}
			//组装历史记录
			function AssmbleList() {
				if ($rootScope.currentpaper.answerContent == null) {
					$rootScope.currentpaper.answerContent = new Array();
				}
				var len = $rootScope.currentpaper.answerContent.length;
				for (var i = 0; i < len; i++) {
					var length = $rootScope.currentpaper.questionlist.length;
					for (var j = 0; j < length; j++) {
						if ($rootScope.currentpaper.answerContent[i].id == $rootScope.currentpaper.questionlist[j].id) {
							//"1|3"多选答案
							var questiontype = $rootScope.currentpaper.questionlist[j].questionType
							if (questiontype == 'singleChoice' || questiontype == 'multipleChoice' || questiontype == 'checking') {
								//单选0，多选1
								var arr = $rootScope.currentpaper.answerContent[i].answer.split("");
								var lenk = arr.length;
								var list = CommFunServ.InitArray($rootScope.currentpaper.questionlist[j].optionContent.length, false);
								var sd = false;
								for (var k = 0; k < lenk; k++) {
									var index = 0;
									if (questiontype == 'checking') {
										index = CommFunServ.GetValueIndex($rootScope.currentpaper.questionlist[j].optionContent, arr[k]);
									} else {
										index = CommFunServ.GetKeyIndex($rootScope.currentpaper.questionlist[j].optionContent, arr[k]);
									}
									if (index >= 0) {
										list[index] = true;
										sd = true;
									}
								}
								$rootScope.currentpaper.questionlist[j].answerArr = list;
								$rootScope.currentpaper.questionlist[j].hasdo = sd;
							}
							break;
						}
					}
				}
				CommFunServ.RefreshData(serverdata);
				$timeout(function() {
					$ionicSlideBoxDelegate.update();
				}, 2000)

			}
			//切换试题类型
			function slideHasChanged(index) {
				//根据大题类型显示头
				var item = $rootScope.currentpaper.questionlist[index];
				if (index == 0) {
					serverdata.titleContent = null;
					serverdata.isShowTitle = true;
				}
				if (index > 0) {
					//与前一题对比查看是否显示大题
					var lastitem = $rootScope.currentpaper.questionlist[index - 1];
					if (item.pq_key == lastitem.pq_key) {
						serverdata.isShowTitle = false;
					} else {
						serverdata.titleContent = null;
						serverdata.isShowTitle = true;
					}
				}
				var len = $rootScope.currentpaper.questiontitle.length;
				for (var i = 0; i < len; i++) {
					if ($rootScope.currentpaper.questiontitle[i].q_key == item.pq_key) {
						AssmbleTitle(i);
						switch ($rootScope.currentpaper.questiontitle[i].questionType) {
							case 'checking':
								serverdata.title = "判断题";
								break;
							case 'singleChoice':
								serverdata.title = "单选题";
								break;
							case 'multipleChoice':
								serverdata.title = "多选题";
								break;
							case '2':
								serverdata.title = "案例题";
								break;
							default:
								serverdata.title = "";
								break;
						}
						CommFunServ.RefreshData(serverdata);
						return;
					}
				}
			}
			//显示头标题
			function AssmbleTitle(index) {
				var item = $rootScope.currentpaper.questiontitle[index];
				if (serverdata.titleContent == null) {
					serverdata.titleContent = new Array();
				}
				if (serverdata.titleContent.indexOf(item) == -1) {
					serverdata.titleContent.unshift(item);
				}
				if (item.questionIndex == 0) {
					var len = $rootScope.currentpaper.questiontitle.length;
					for (var i = 0; i < len; i++) {
						if (item.pq_key == $rootScope.currentpaper.questiontitle[i].q_key) {
							AssmbleTitle(i);
							return;
						}
					}
				}
			}
			//单选
			function SelectAnswer(parentindex, index) {
				var item = $rootScope.currentpaper.questionlist[parentindex];
				if (item.answerArr == null) {
					item.answerArr = CommFunServ.InitArray(item.optionContent.length, false)
					item.answerArr[index] = true;
					item.hasdo = true;
				} else {
					if (item.questionType == 'singleChoice' || item.questionType == 'checking') {
						if (item.answerArr[index]) {
							item.answerArr[index] = false;
							item.hasdo = false;
						} else {
							item.answerArr = CommFunServ.InitArray(item.optionContent.length, false);
							item.answerArr[index] = true;
							item.hasdo = true;
						}
					}else if(item.questionType == 'multipleChoice'){
						item.answerArr[index] = !item.answerArr[index];
					}
				}
				var arr = []
				var len = item.answerArr.length;
				for (var i = 0; i < len; i++) {
					if (item.answerArr[i]) {
						var value = '';
						if (item.questionType == 'checking') {
							var str = CommFunServ.GetValue(item.optionContent, i);
							value = str.substr(2, str.length - 1);
						} else {
							value = CommFunServ.GetKey(item.optionContent, i);
						}
						arr.push(value);
					}
				}
				var str = arr.join("");
				//答案是否存在，修改答案
				if ($rootScope.currentpaper.answerContent == null) {
					$rootScope.currentpaper.answerContent = new Array();
				}
				var length = $rootScope.currentpaper.answerContent.length;
				for (var j = 0; j < length; j++) {
					if ($rootScope.currentpaper.answerContent[j].id == item.id) {
						$rootScope.currentpaper.answerContent[j].answer = str;
						if (item.questionType == 'checking' || item.questionType == 'singleChoice') { //单选
							NextTest();
						}
						return;
					}
				}
				//添加答案
				var answeritem = {
					id: item.id,
					answer: str
				}
				$rootScope.currentpaper.answerContent.push(answeritem);
				if (item.questionType == 'checking' || item.questionType == 'singleChoice') { //判断，单选
					NextTest();
				}
			}

			//简答题评估分数
			function Estimate(index, score) {
				//存储答案分数
				$rootScope.currentpaper.questionlist[parentindex].hasdo = true;
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
				var length = $rootScope.currentpaper.questionlist.length - 1;
				if ($ionicSlideBoxDelegate.currentIndex() >= length) {
					//已到最后题
					return;
				}
				$ionicSlideBoxDelegate.next();
				//记录历史(未完成)
			}
			//保存历史
			function SaveAnswer() {

				//保存历史
				var paperid = $rootScope.currentpaper.paperID;
				var content = JSON.stringify($rootScope.currentpaper.answerContent);
				DataServ.BaseSaveUpdate('tb_History', ["PaperID", "UserID", "Time", "Soure", "Content", "Type", "IsEnd", "IsSync"], [paperid, '', timeCount, 0, content, 0, 0, false], 'PaperID=? and Type=?', [paperid, 0]).then(function(res) {

				})
			}

			function Back() {
				SaveAnswer();
				Destory();
				//返回试卷详细
				$state.go('paperDetail');
			}
			//交卷
			function Assignment() {
				SaveAnswer();
				$rootScope.currentpaper.rtime = timeCount;
				Destory()
				$state.go('answerCard');
			}
			//初始化考试时间秒、分、小时
			function InitTime(sec) {
				timeCount = sec;
				StartTime();
			}
			//开始及时
			function StartTime() {
				timer = $timeout(function() {
					timeCount++;
					ShowTime(timeCount);
					StartTime();
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
				var hour = parseInt(time / 3600);
				var minute = parseInt(time % 3600 / 60);
				var second = time % 60;
				serverdata.rtime = AssmbleTime(hour) + ":" + AssmbleTime(minute) + ":" + AssmbleTime(second);
				CommFunServ.RefreshData(serverdata);
			}
			//显示数字填补，即当显示的值为0-9时
			function AssmbleTime(arg) {
				return arg >= 10 ? arg : "0" + arg;
			}

			function Destory() {
				serverdata.titleContent = null;
				serverdata.isShowTitle = false; //是否显示大题标题
				serverdata.titleContent = null; //当前大题内容
				serverdata.title = ''; //题型
				serverdata.isUpload = false; //是否交卷
				serverdata.questiontitle = ''; //题干
				if (timer) {
					$timeout.cancel(timer);
					timer = null;
				}
			}
		}
	])