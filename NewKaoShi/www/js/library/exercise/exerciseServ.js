libraryModule
	.factory('ExerciseServ', ['$rootScope', 'GetDataServ', 'CommFunServ', '$ionicSlideBoxDelegate', '$state', 'SaveDataServ',
		function($rootScope, GetDataServ, CommFunServ, $ionicSlideBoxDelegate, $state, SaveDataServ) {
			var currentType;//currentType=0试卷，currentType=1错题与收藏
			var serverdata = {
				title: '', //题型
				rtime: '', //考试时间
				isUpload: false, //是否交卷
				answerContent: [] //试卷所有试题答案

			}
			var server = {
				GetServerData: GetServerData,
				slideHasChanged: slideHasChanged, //改变试题
				InitList: InitList, //初始化
				SelectAnswer: SelectAnswer, //选择答案
				LastTest: LastTest, //上一题
				NextTest: NextTest, //下一题
				Back: Back //返回

			}

			function GetServerData() {
				return serverdata;
			}
			//初始化数据
			function InitList(bool,type) {
				currentType=type;
				slideHasChanged(0);
				//bool=true有历史记录，type=0试卷，type=1错题与收藏
				if (bool == 'true' && type=='0') {
					GetHistory();
				}
			}
			//获取历史
			function GetHistory() {
				//type=1表示历史试卷练习
				GetDataServ.GetHistoyPaper($rootScope.currentPaper.PaperID, 1).then(function(data) {
					if (data && data.length > 1) {
						//存在历史
						serverdata.answerContent = eval("(" + data[0].Content + ")");
						InitTime(parseInt(data[0].Time));
						AssmbleList();
					}
				})
			}
			//组装历史记录
			function AssmbleList() {
				var len = serverdata.answerContent.length;
				for (var i = 0; i < len; i++) {
					var length = $rootScope.questionlist.length;
					for (var j = 0; j < length; j++) {
						if (serverdata.answerContent[i].id == $rootScope.questionlist[j].ID) {
							//"1|3"多选答案
							if ($rootScope.questionlist[j].QuestionType != 2) {
								//单选0，多选1
								var arr = serverdata.answerContent[i].answer.split("|");
								var lenk = arr.length;
								var list = new Array($rootScope.questionlist[j].OptionContent.length);
								for (var k = 0; k < lenk; k++) {
									list[arr[k]] = true;
								}
								$rootScope.questionlist[j].answer = list;
							}
							break;
						}
					}
				}
			}
			//切换试题类型
			function slideHasChanged(index) {
				var item = $rootScope.questionlist[index];
				switch (item.QuestionType) {
					case '0':
						serverdata.title = "单选题";
						break;
					case '1':
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
			}
			//单选
			function SelectAnswer(parentindex, index) {
				var item = $rootScope.questionlist[parentindex];
				if ($rootScope.questionlist[parentindex].answer == null || item.QuestionType == 0) {
					$rootScope.questionlist[parentindex].answer = CommFunServ.InitArray(item.OptionContent.length, false)
				}
				$rootScope.questionlist[parentindex].answer[index] = !$rootScope.questionlist[parentindex].answer[index];

				var arr = []
				var len = $rootScope.questionlist[parentindex].answer.length;
				for (var i = 0; i < len; i++) {
					if ($rootScope.questionlist[parentindex].answer[i]) {
						arr.push(i);
					}
				}
				var str = arr.join("|");
				//答案是否存在，修改答案
				var length = serverdata.answerContent.length;
				for (var j = 0; j < length; j++) {
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
				var length = $rootScope.questionlist.length - 1;
				if ($ionicSlideBoxDelegate.currentIndex() >= length) {
					//已到最后题
					return;
				}
				$ionicSlideBoxDelegate.next();
				//记录历史(未完成)
			}

			function Back() {
				//保存历史
				var item = [{
					PaperID: $rootScope.currentPaper.PaperID,
					UserID: '',
					Time: timeCount,
					Soure: 0,
					Content: JSON.stringify(serverdata.answerContent),
					Type: 0, //考试
					IsSync: false
				}]
				SaveDataServ.SyncHistoryData(item);
				if (timer) {
					$timeout.cancel(timer);
					timer = null;
				}
				if(currentType=='0'){
				//返回试卷详细
					$state.go('paperDetail');
				}else{
					//返回错误列表
					$state.go('tab.error');
				}
			}
		}
	])