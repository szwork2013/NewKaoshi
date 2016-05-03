commModule
	.factory('GetDataServ', ['$http', '$q', 'SqliteServ',
		function($http, $q, SqliteServ) {
			var server = {
				GetExamType:GetExamType,//获取考试类型
				GetPaperData:GetPaperData,//获取类型下所有试卷
				GetDetailPaperData:GetDetailPaperData,//获取试卷详情
				GetHistoyPaper:GetHistoyPaper//获取历史记录
			}
			return server;
			//类型id，获取考试分类
			function GetExamType() {
				var q = $q.defer();
				SqliteServ.select('tb_ExamTypes', '', []).then(function(data) {
					q.resolve(data)
				})
				return q.promise;
			}
			//类型id，获取试卷
			function GetPaperData(id) {
				var q = $q.defer();
				SqliteServ.select('tb_Papers', 'ExamTypeID=?', [id]).then(function(data) {
					q.resolve(data)
				})
				return q.promise;
			}
			//试卷id，获取试卷详情
			function GetDetailPaperData(id) {
				var q = $q.defer();
				SqliteServ.select('tb_Papers', 'PaperID=?', [id]).then(function(data) {
					q.resolve(data)
				})
				return q.promise;
			}
			//试卷id，获取试卷历史
			function GetHistoyPaper(id){
				var q = $q.defer();
				SqliteServ.select('tb_History', 'PaperID=?', [id]).then(function(data) {
					q.resolve(data)
				})
				return q.promise;
			}
			//试卷id，获取试题
			function GetQuestionData(id) {
				SqliteServ.select('tb_Question', 'PaperID=?', [id]).then(function(data) {

				})
			}
			//无参数，用于获取广告图
			function GetHomeData() {

			}
			//试题id,用于错题、收藏
			function GetQuestionData(id) {
				SqliteServ.select('tb_UserQuestions', 'PaperID=?', [id]).then(function(data) {

				})
			}
		}
	])