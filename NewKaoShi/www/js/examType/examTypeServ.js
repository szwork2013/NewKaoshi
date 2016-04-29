classifyModule
	.factory('ExamTypeServ',['$state','$rootScope','CommFunServ',
		function($state,$rootScope,CommFunServ) {
			var serverdata={
				examTypeList:[]
			}
			var server = {
				BindServerData: BindServerData,
				GetExmaList: GetExmaList,
				BackLibrary: BackLibrary
			}
			return server;

			function BindServerData() {
				return serverdata;
			}
			//获取考试类型
			function GetExmaList(id) {
				serverdata.examTypeList = [{
					id: 0,
					name: '教师类'
				}, {
					id: 1,
					name: '金融类'
				}, {
					id: 2,
					name: '工程类'
				}, {
					id: 3,
					name: '计算机类'
				}, ]
				if (examTypeList.length <= 0) {
					$rootScope.examTypeID = id;
					$state.go('tab.home');
				}
				CommFunServ.RefreshData(serverdata);
			}
			//返回题库
			function BackLibrary() {
				$state.go('tab.library');
			}
		}
	])