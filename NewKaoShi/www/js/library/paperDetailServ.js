libraryModule
	.factory('PaperDetailServ', ['$state', '$rootScope', 'GetDataServ',
		function($state, $rootScope, GetDataServ) {
			var serverdata = {
				haveExercise: false, //是否有练习历史
				haveKaoshi: false //是否有考试历史
			}
			var server = {
				GetServerData: GetServerData,
				CheckHistory: CheckHistory,
				StartExams: StartExams,
				StartExersice: StartExersice,
				BackLibrary: BackLibrary,
				GeTQuestionList:GeTQuestionList
			}
			return server;

			function GetServerData() {
				return serverdata;
			}
			//检查历史记录
			function CheckHistory() {
				//在试卷已经下载的情况下才检查是否有历史记录
				if ($rootScope.currentPaper && $rootScope.currentPaper.IsDownload != 0) {
					GetDataServ.GetHistoyPaper($rootScope.currentPaper.PaperID, 0).then(function(data) {
						if (data && data.length > 0) { //存在考试历史记录
							serverdata.haveKaoshi = true;
						} else {
							serverdata.haveKaoshi = false;
						}
					})
					GetDataServ.GetHistoyPaper($rootScope.currentPaper.PaperID, 1).then(function(data) {
						if (data && data.length > 0) { //存在练习历史记录
							serverdata.haveExercise = true;
						} else {
							serverdata.haveExercise = false;
						}
					})
				}
			}

			function BackLibrary() {
				$state.go('tab.library');
			}
			//开始考试
			function StartExams(bool) {
				$state.go('kaoshi',{
					history:bool
				})
			}
			//开始练习
			function StartExersice(bool) {
				$state.go('exercise', {
					history:bool,
					type: 0
				})
			}
			//获取试卷试题,再详细下载节省下载时间，看起来数据获取更快，同时更利于后续组装，不然slide-box组装样式无法获取
			function GeTQuestionList() {
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
								$rootScope.questionlist = data;
							}
						})
					}
				}
			}
		}
	])