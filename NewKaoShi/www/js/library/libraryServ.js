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
				id='4028188154ce38b40154ce3cc6690002'
				DataServ.BaseSelect('select * from tb_Papers where ExamTypeID=?',[id]).then(function(data) {
					if(data && data.length>0){
						var len=data.length;
						for(var i=0;i<len;i++){
						 	 var datea=new Date(data[i].UpdateTime.replace(/-/g,"/"));
							//data[i].UpdateTime=CommFunServ.format(datea,"yyyy-MM-dd hh:mm:ss");
							data[i].UpdateTime=datea;
						}
						
						serverdata.paperlist = data;
						CommFunServ.RefreshData(serverdata)
					}
					
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