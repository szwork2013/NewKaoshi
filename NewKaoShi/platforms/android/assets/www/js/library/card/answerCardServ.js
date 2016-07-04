libraryModule
	.factory('AnswerCardServ', ['$rootScope', 'CommFunServ', '$state', 'DataServ',
		function($rootScope, CommFunServ, $state, DataServ) {
			var serverdata = {
				hasdoNum: 0, //已做题数
				time: 0, //考试已用时间
			}
			var server = {
				GetServerData: GetServerData,
				InitData: InitData,
				ConfirmAssignment: ConfirmAssignment
			}
			return server;

			function GetServerData() {
				return serverdata;
			}
			//初始化数据
			function InitData() {
				DataServ.GetHistoy($rootScope.currentpaper.paperID, 0).then(function(data) {
					if (data && data.length > 0) {
						if(data[0].Content==null || data[0].Content==''){
							serverdata.hasdoNum=0
						}else{
							if(data[0].Content && data[0].Content!="null"){
							var arr = eval("(" + data[0].Content + ")");
							serverdata.hasdoNum = arr.length;
							}
						}
					}
				})
				serverdata.time =CommFunServ.ShowTime( $rootScope.currentpaper.rtime);
				CommFunServ.RefreshData(serverdata);
			}
			//确定交卷
			function ConfirmAssignment() {
				//在历史记录标记考试已完成（未完成）
				DataServ.MarkExamEnd($rootScope.currentpaper.paperID);
				$state.go('result');
			}
		}
	])