libraryModule
	.factory('LibraryServ', ['$state', 'DataServ', 'CommFunServ', '$rootScope', 
		function($state, DataServ, CommFunServ, $rootScope) {
			//当前试卷信息
			$rootScope.currentpaper={
				paperID:0,//当前试卷ID
				itemNum:0,//总题数
				totalTime:0,//总时间
				totalScore:0,//总分数
				passMark:0,//及格分数
				rtime:0,//时间
				score:0,//得分
				questionlist:[],//试题列表
				questiontitle:[],//标题列表
				answerContent:null//答案列表
			}
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
						$rootScope.currentpaper.paperID= data[0].PaperID;
						$rootScope.currentpaper.itemNum=data[0].ItemNum;
						$rootScope.currentpaper.totalTime=data[0].TotalTime;
						$rootScope.currentpaper.passMark=data[0].PassMark;
						$rootScope.currentpaper.totalScore=data[0].TotalScore;
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