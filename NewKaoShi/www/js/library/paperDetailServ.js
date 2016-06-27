libraryModule
	.factory('PaperDetailServ', ['$state', '$rootScope', 'DataServ', '$ionicLoading', '$timeout', 'CommFunServ',

		function($state, $rootScope, DataServ, $ionicLoading, $timeout, CommFunServ) {

			var serverdata = {
				paperdetail: null, //试卷详情
				haveExercise: false, //是否有练习历史
				haveKaoshi: false, //是否有考试历史
				isEnd: false //考试是否交卷
			}
			var server = {
				GetServerData: GetServerData,
				InitData: InitData,
				Start: Start,
				BackLibrary: BackLibrary
			}
			return server;

			function GetServerData() {
				return serverdata;
			}
			//初始化试卷详情
			function InitData() {
				//获取试卷详情
				DataServ.GetPaperData($rootScope.currentpaper.paperID).then(function(data) {
					if (data && data.length > 0) {
						serverdata.paperdetail = data[0];
						//获取历史，已下载的试卷才会出现历史记录
						if (serverdata.paperdetail.IsDownload != 0) {
							CheckHistory();
						}

					}
				})
			}
			//检查历史记录
			function CheckHistory() {
				DataServ.GetHistoy($rootScope.currentpaper.paperID).then(function(data) {
					serverdata.haveKaoshi = false;
					serverdata.haveExercise = false;
					serverdata.isEnd = false;
					if (data && data.length > 0) {
						var len = data.length;
						for (var i = 0; i < len; i++) {
							if (data[i].Type == 0) { //存在考试记录
								serverdata.haveKaoshi = true;
								if (data[i].IsEnd == 1) {
									serverdata.isEnd = true;
								}
								$rootScope.currentpaper.rtime = data[i].Time;
							} else if (data[i].Type == 1) { //存在练习记录
								serverdata.haveExercise = true;
							}
						}
					}
				})
			}
			//开始考试、练习
			function Start(type) {
				//获取试卷所有试题
				DataServ.GetPaperQuestions($rootScope.currentpaper.paperID).then(function(data) {
				
					if (data && data.length > 0) {
						//组装试题数据
						AssmbleQuestionData(data, type);
					} else { //数据库无数据
						//显示加载
						$ionicLoading.show({
								template: '加载试题中...'
							})
							//请求服务器数据
						DataServ.PostQuestions($rootScope.currentpaper.paperID).then(function(data) {
							$ionicLoading.hide(); //隐藏加载
							if (data && data.length > 0) {
								//请求图片
									//DataServ.PostQuestionPic("0f5ac1d4c612408ab9cbb4912f3be38d")
								//组装试题数据
								AssmbleQuestionData(data, type);
								//修改试卷状态
								DataServ.UpdatePaperStatus(data[0].paperId);
								
							} else {
								//提示加载失败(未完成)
							}
						});
					}
				})
			}
			//组装试题数据
			function AssmbleQuestionData(data, type) {

				var len = data.length;
				$rootScope.currentpaper.questionlist = []; //试题列表
				$rootScope.currentpaper.questiontitle = []; //标题列表
				$rootScope.currentpaper.answerContent = null; //答案列表
				for (var i = 0; i < len; i++) {
					if (data[i].answer != null && data[i].answer != '') {
						data[i].optionContent = JSON.parse(data[i].optionContent); //eval("(" + + ")");
						
						//组装选项
						$rootScope.currentpaper.questionlist.push(data[i]);
					} else {
						$rootScope.currentpaper.questiontitle.push(data[i]);
					}
				}
				//跳转到试题
				GoExam(type);
			}
			//返回题库
			function BackLibrary() {
				$state.go('tab.library');
			}
			//跳转到试题
			function GoExam(type) {
				if (type == 0) {
					if (serverdata.isEnd) { //上一次考试已确认交卷
						$state.go('result')
					} else {
						$state.go('kaoshi', {
							history: serverdata.haveKaoshi
						})
					}
				} else {
					$state.go('exercise', {
						history: serverdata.haveExercise,
						type: 0
					})
				}
			}
		}
	])