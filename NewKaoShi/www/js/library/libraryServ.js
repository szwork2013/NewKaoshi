libraryModule
	.factory('LibraryServ', ['$state', 'GetDataServ', 'CommFunServ', '$rootScope', 'PostServ', 'SaveDataServ',
		function($state, GetDataServ, CommFunServ, $rootScope, PostServ, SaveDataServ) {
			var serverdata = {
				paperlist: []
			}
			var server = {
				GetServerData: GetServerData,
				InitData: InitData,
				GoExamType: GoExamType,
				GoPaperDetail: GoPaperDetail
			}
			return server;

			function GetServerData() {
				return serverdata;
			}

			function InitData(id) {
				GetDataServ.GetPaperData(id).then(function(data) {
					serverdata.paperlist = data;
					CommFunServ.RefreshData(serverdata)
				})
			}

			function GoPaperDetail(id) {
				GetDataServ.GetDetailPaperData(id).then(function(data) {
					if (data) {
						$rootScope.currentPaper = data[0];
						$rootScope.paperInfo = {
							paperId: id,
							haveTest: false,
							haveKaoshi: false,
							currentType: 0, //当前模式0表示考试，1表示练习
							rtime: 0
						}
						GetDataServ.GetHistoyPaper(id).then(function(items) {
							if (items) {
								//历史记录,根据历史记录显示按钮
							}
							$state.go('paperDetail');
						})
					}
				})

			}

			function GoExamType() {
				$state.go('examType', {
					type: 1
				});
			}
		}
	])