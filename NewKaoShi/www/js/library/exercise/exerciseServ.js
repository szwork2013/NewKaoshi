libraryModule
	.factory('ExerciseServ', ['$rootScope', 'DataServ', 'CommFunServ', '$ionicSlideBoxDelegate', '$state',
		function($rootScope, DataServ, CommFunServ, $ionicSlideBoxDelegate, $state) {
			var currentType; //currentType=0试卷，currentType=1错题与收藏
			var currentIndex; //当前试题索引
			var serverdata = {
				title: '', //题型
				rtime: '', //考试时间
				isUpload: false, //是否交卷
				answerContent: [], //试卷所有试题答案
				showAnswer: false,
				btnStatus: 0

			}
			var server = {
				GetServerData: GetServerData,
				slideHasChanged: slideHasChanged, //改变试题
				InitList: InitList, //初始化
				SelectAnswer: SelectAnswer, //选择答案
				LastTest: LastTest, //上一题
				NextTest: NextTest, //下一题
				Back: Back, //返回
				ShowAnswer: ShowAnswer //显示答案

			}
			return server;

			function GetServerData() {
				return serverdata;
			}
			//初始化数据
			function InitList(obj) {
				currentType = obj.type;
				AssmbleRightAnswer();
				//bool=true有历史记录，type=0试卷，type=1错题与收藏
				if (obj.history == 'true') {
					GetHistory();
				}else{
					var index=0;
					if(obj.qKey){
						var len=$rootScope.currentpaper.questionlist.length;
						for(var i=0;i<len;i++){
							if($rootScope.currentpaper.questionlist[i].q_key==obj.qKey){
								index=i;
								break;
							}
						}
					}
					slideHasChanged(index);
				}
			}

			function AssmbleRightAnswer() {
				var len = $rootScope.currentpaper.questionlist.length;
				for (var i = 0; i < len; i++) {
					var questiontype=$rootScope.currentpaper.questionlist[j].questionType
					
					if ( questiontype== 'singleChoice'||questiontype== 'mutepliChoice' || questiontype== 'checking') {
						$rootScope.questionlist[i].rightAnswer = CommFunServ.InitArray($rootScope.questionlist[i].optionContent.length, false);
						var answerlist = $rootScope.questionlist[i].answer.split("");
						var length = answerlist.length;
						for (var j = 0; j < length; j++) {
							var index=0;
							if(questiontype== 'checking'){
								index=CommFunServ.GetValueIndex($rootScope.currentpaper.questionlist[i].optionContent,answerlist[j]);
							}else{
								index=CommFunServ.GetKeyIndex($rootScope.currentpaper.questionlist[i].optionContent,answerlist[j]);
							}
							$rootScope.questionlist[i].rightAnswer[index] = true;
						}
					}

				}
			}
			//获取历史
			function GetHistory() {
				//type=1表示历史试卷练习
				DataServ.GetHistoy($rootScope.currentpaper.paperID, 0).then(function(data) {
					if (data && data.length > 0) {
						//存在历史
						if($rootScope.currentpaper.answerContent==null){
							$rootScope.currentpaper.answerContent=new Array();
						}
						$rootScope.currentpaper.answerContent = eval("(" + data[0].Content + ")");
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
								var list = new Array($rootScope.questionlist[j].OptionContent.length + 1);
								var sd = false;
								for (var k = 0; k < lenk; k++) {
									list[arr[k]] = true;
									sd = true;
								}
								$rootScope.questionlist[j].answer = list; //[false,true,false],length为答案选项
								$rootScope.questionlist[j].hasdo = sd;
								CommFunServ.RefreshData(serverdata);
							}
							//简答未实现
							break;
						}
					}
				}
				slideHasChanged(0);
			}
			//切换试题类型
			function slideHasChanged(index) {
				currentIndex = index;
				var item = $rootScope.questionlist[index];
				serverdata.showAnswer = item.hasdo;
				if (serverdata.showAnswer) {
					serverdata.btnStatus = 1;
				}
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
					$rootScope.questionlist[parentindex].answer = CommFunServ.InitArray(item.OptionContent.length + 1, false)
				}
				if (item.QuestionType == 0) { //单选
					$rootScope.questionlist[parentindex].hasdo = !$rootScope.questionlist[parentindex].hasdo;
				}
				serverdata.showAnswer = $rootScope.questionlist[parentindex].hasdo;
				if (serverdata.showAnswer) {
					serverdata.btnStatus = 1;
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
					Time: 0,
					Soure: 0,
					Content: JSON.stringify(serverdata.answerContent),
					Type: 1, //练习
					IsSync: false
				}]
				DataServ.SaveHisData(item);
				if (currentType == '0') {
					//返回试卷详细
					$state.go('paperDetail');
				} else {
					//返回错误列表
					$state.go('tab.error');
				}
			}
			//显示答案
			function ShowAnswer() {
				var item = $rootScope.questionlist[currentIndex];
				if (item.QuestionType != 2) { //单选，多选
					var len = item.OptionContent.length;
					$rootScope.questionlist[currentIndex].hasdo = true;
					SelectAnswer(currentIndex, len);
				}

			}

			function Conllect(bool) {
				if (bool) {
					serverdata.btnStatus = 2;
				} else {
					serverdata.btnStatus = 1;
				}
			}
		}
	])