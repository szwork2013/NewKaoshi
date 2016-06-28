libraryModule
	.factory("ResultCardServ", ['$rootScope', '$state', 'PaperDetailServ', 'DataServ', 'CommFunServ',
		function($rootScope, $state, PaperDetailServ, DataServ, CommFunServ) {
			var serverdata = {
				type: 0,
				hasdocount: 0,
				rightdocount: 0
			}
			var server = {
				GetServerData: GetServerData,
				InitData: InitData,
				GoExercise: GoExercise,
				TestAgain: TestAgain,
				Destory:Destory
			}
			return server;

			function GetServerData() {
				return serverdata;
			}

			function InitData(type) {
				serverdata.type = type;
				if (type == 1) {
					serverdata.rightdocount=0;
					ResultCount();
				}
				CommFunServ.RefreshData(serverdata);
			}

			function ResultCount() {
				if ($rootScope.currentpaper && $rootScope.currentpaper.answerContent) {
					var length = $rootScope.currentpaper.answerContent.length;
					serverdata.hasdocount = length;
					if ($rootScope.currentpaper.questionlist) {
						var len = $rootScope.currentpaper.questionlist.length;
						for (var i = 0; i < len; i++) {
							$rootScope.currentpaper.questionlist[i].isRight = 2;
							for (var j = 0; j < length; j++) {
								if ($rootScope.currentpaper.questionlist[i].id == $rootScope.currentpaper.answerContent[j].id) {
									var paperid = $rootScope.currentpaper.questionlist[i].paperId;
									RightCount(i, $rootScope.currentpaper.answerContent[j], paperid);
									continue;
								}
							}
						}
					}
				}else{
					var lena = $rootScope.currentpaper.questionlist.length;
					serverdata.hasdocount=0;
					serverdata.rightdocount=0;
					for(var k=0;k<lena;k++){
						$rootScope.currentpaper.questionlist[k].isRight=0;
					}
					
				}
				CommFunServ.RefreshData(serverdata);

			}
			function RightCount(index, item,paperid){
				var rightarr = $rootScope.currentpaper.questionlist[index].answer.split(""); //正确答案
				var answerarr = item.answer.split("");//回答答案
				if (rightarr.length != answerarr.length) {
					$rootScope.currentpaper.questionlist[index].isRight = 0;
					return; //选多或选少不得分
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
								serverdata.rightdocount++;
							}
							return;
					}
				}
				if (count == len) {
					serverdata.rightdocount++;
					$rootScope.currentpaper.questionlist[index].isRight = 1;
				}else{
					$rootScope.currentpaper.questionlist[index].isRight = 0;
				}
			}
			//进入答案解析
			function GoExercise(q_key) {
				var len = $rootScope.currentpaper.answerContent.length;
				for (var i = 0; i < len; i++) {
					var length = $rootScope.currentpaper.questionlist.length;
					for (var j = 0; j < length; j++) {
						if ($rootScope.currentpaper.answerContent[i].id == $rootScope.currentpaper.questionlist[j].id) {
							//"1|3"多选答案
							var questiontype = $rootScope.currentpaper.questionlist[j].questionType
							if (questiontype == 'singleChoice' || questiontype == 'mutepliChoice' || questiontype == 'checking') {
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
				$state.go('exercise', {
					history: false,
					type: 2,
					qKey: q_key
				})
			}
			//重新考试
			function TestAgain() {
				//提示是否重新考试
				PaperDetailServ.Start(0);
				$rootScope.currentpaper.answerContent = null;
				//删除历史数据
				DataServ.DeletKaoshiHis($rootScope.currentpaper.paperID).then(function(data) {
					$state.go('kaoshi', {
						history: false
					});
				});
			}
			//销毁
			function Destory(){
				serverdata.hasdocount=0;
				serverdata.rightdocount=0;
			}
		}
	])