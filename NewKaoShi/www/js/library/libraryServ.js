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
						$state.go('paperDetail');
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