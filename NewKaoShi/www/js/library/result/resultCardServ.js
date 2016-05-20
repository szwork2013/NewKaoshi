libraryModule
	.factory("ResultCardServ", ['$rootScope', '$state', 'PaperDetailServ', 'DataServ','CommFunServ',
		function($rootScope, $state, PaperDetailServ, DataServ,CommFunServ) {

			var server = {
				GoExercise: GoExercise,
				TestAgain: TestAgain
			}
			return server;
			//进入答案解析
			function GoExercise(q_key) {
				var len = $rootScope.currentpaper.answerContent.length;
				for (var i = 0; i < len; i++) {
					var length = $rootScope.currentpaper.questionlist.length;
					for (var j = 0; j < length; j++) {
						if ($rootScope.currentpaper.answerContent[i].id == $rootScope.currentpaper.questionlist[j].id) {
							//"1|3"多选答案
							var questiontype=$rootScope.currentpaper.questionlist[j].questionType
							if ( questiontype== 'singleChoice'||questiontype== 'mutepliChoice'||questiontype== 'checking') {
								//单选0，多选1
								var arr = $rootScope.currentpaper.answerContent[i].answer.split("");
								var lenk = arr.length;
								var list = CommFunServ.InitArray($rootScope.currentpaper.questionlist[j].optionContent.length,false);
								var sd = false;
								for (var k = 0; k < lenk; k++) {
									var index=0;
									if(questiontype== 'checking'){
										index=CommFunServ.GetValueIndex($rootScope.currentpaper.questionlist[j].optionContent,arr[k]);
									}else{
										index=CommFunServ.GetKeyIndex($rootScope.currentpaper.questionlist[j].optionContent,arr[k]);
									}
									if(index>=0){
										list[index] = true;
										sd=true;
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
		}
	])