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
				BackLibrary: BackLibrary
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
		}
	])