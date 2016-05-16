libraryModule
	.factory('LibraryServ', ['$state', 'DataServ', 'CommFunServ', '$rootScope', 
		function($state, DataServ, CommFunServ, $rootScope) {
			var serverdata = {
				paperlist: []
			}
			var server = {
				GetServerData: GetServerData,//绑定数据
				InitData: InitData,//初始化试卷列表
				GoExamType: GoExamType,//进入考试类型
				GoPaperDetail: GoPaperDetail//进入试卷详情
			}
			return server;
			
			function GetServerData() {
				return serverdata;
			}
			//初始化试卷列表
			function InitData(id) {
				DataServ.GetPaperList(id).then(function(data) {
					serverdata.paperlist = data;
					CommFunServ.RefreshData(serverdata)
				})
			}
			function GoPaperDetail(id) {
				DataServ.GetPaperData(id).then(function(data) {
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