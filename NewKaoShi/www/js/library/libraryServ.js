libraryModule
	.factory('LibraryServ', ['$state', 'GetDataServ', 'CommFunServ', '$rootScope',
		function($state, GetDataServ, CommFunServ, $rootScope) {
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
							haveTest: false,
							haveKaoshi: true,
							currentType: 0, //当前试卷模式0表示考试，1表示练习
							rtime: 0
						}
						GetDataServ.GetHistoyPaper(id).then(function(items) {
							if (items) {
								//历史记录
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