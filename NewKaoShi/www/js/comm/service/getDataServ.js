commModule
	.factory('GetDataServ', ['$http', '$q', '$rootScope', function($http, $q, $rootScope) {
		var server = {

		}
		return server;
		//无参数，获取考试分类
		function GetTypeData() {
			$rootScope.dbbase.OpenTransaction(function(tx) {
				$rootScope.dbbase.SaveOrUpdateTable();
			})
		}
		//类型id，获取考试类型
		function GetTypeItemData(id) {
			if (id == null) { //考试基类
				id = 0;
			}
			if ($rootScope.dbbase) {
				$rootScope.dbbase.OpenTransaction(function(tx) {
					$rootScope.dbbase.SelectTable(tx, 'select * from tb_ExamTypes where ParentID=?', [id], function(data) {

					});
				})
			}
		}
		//类型id，获取试卷
		function GetPaperData(id){
			if ($rootScope.dbbase) {
				$rootScope.dbbase.OpenTransaction(function(tx) {
					$rootScope.dbbase.SelectTable(tx, 'select * from tb_Papers where ExamTypeID=?', [id], function(data) {

					});
				})
			}
		}
		//试卷id，获取试题
		function GetQuestionData(id) {
			if ($rootScope.dbbase) {
				$rootScope.dbbase.OpenTransaction(function(tx) {
					$rootScope.dbbase.SelectTable(tx, 'select * from tb_Question where PaperID=?', [id], function(data) {

					});
				})
			}
		}
		//无参数，用于获取广告图
		function GetHomeData() {

		}
		//试题id,用于错题、收藏
		function GetQuestionData(id) {

		}
	}])