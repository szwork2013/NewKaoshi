commModule
	.factory("DataServ", ['$http', '$q', 'SqliteServ',
		function($http, $q, SqliteServ) {
			var server = {
SaveHisData:SaveHisData,

				GetExamType: GetExamType,
				GetPaperList: GetPaperList,
				GetPaperData: GetPaperData,
				GetHistoy: GetHistoy,
				GetPaperQuestions: GetPaperQuestions
			}
			return server;
			/*
			 * 服务器数据请求
			 */
			//获取所有数据（考试类型、试卷）
			function PostAll() {

			}
			//获取历史数据
			function PostHisData() {

			}
			//试卷id，获取试题
			function PostQuestions(id) {
				//请求数据
				//存储数据
				//修改试卷数据下载状态
			}

			function BasePost(url, parma) {
				var q = $q.defer();
				$http({
					method: 'POST',
					url: url,
					params: parma,
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded:charset=utf-8'
					}
				}).success(function(response) {
					q.resolve(response);
				});
				return q.promise;
			}
			/*
			 * 数据库存储数据
			 */
			//存储首页展示信息
			function SaveShowData(data) {
				/*SqliteServ.transaction(function(tx) {
					var len = data.length;
					for (var i = 0; i < len; i++) {
						SqliteServ.saveOrupadte(tx, 'tb_History', ["PaperID", "UserID", "Time", "Soure", "Content", "Type", "IsSync"], [data[i].PaperID, data[i].UserID, data[i].Time, data[i].Soure, data[i].Content, data[i].Type, data[i].IsSync], "PaperID=? and Type=?", [data[i].PaperID, data[i].Type]);
					}
				})*/
			}
			//存储考试类型数据
			function SaveExamType(data) {
				SqliteServ.transaction(function(tx) {
					var len = data.length;
					for (var i = 0; i < len; i++) {
						SqliteServ.saveOrupadte(tx, 'tb_ExamTypes', ["ExamTypeID", "ExamTypeName", "ParentID"], [data[i].ExamTypeID, data[i].ExamTypeName, data[i].ParentID], "ExamTypeID=?", [data[i].ExamTypeID]);
					}
				})
			}
			//存储试卷数据
			function SavePaper(data) {
				SqliteServ.transaction(function(tx) {
					var len = data.length;
					for (var i = 0; i < len; i++) {
						SqliteServ.saveOrupadte(tx, 'tb_Papers', ["PaperID", "PaperContent", "ExamTypeID", "PaperTypeID", "TotalScore", "ItemNum", "UserCount", "Status", "PassMark", "UpLoaderID", "TotalTime", "Year", "ContainQuestionTypes", "CreateTime", "CreatorID", "UpdateTime", "UpdaterID"], [data[i].PaperID, data[i].PaperContent, data[i].ExamTypeID, data[i].PaperTypeID, data[i].TotalScore, data[i].ItemNum, data[i].UserCount, data[i].IsVip, data[i].PassMark, data[i].UpLoaderID, data[i].TotalTime, data[i].Year, data[i].ContainQuestionTypes, data[i].CreateTime, data[i].CreatorID, data[i].UpdateTime, data[i].UpdaterID], "PaperID=?", [data[i].PaperID]);
					}
				})
			}
			//存储试题数据
			function SaveQuestion(data) {
				SqliteServ.transaction(function(tx) {
					var len = data.length;
					for (var i = 0; i < len; i++) {
						SqliteServ.saveOrupadte(tx, 'tb_Question', ["ID", "PaperID", "QuestionType", "QuestionContent", "QuestionIndex", "Soure", "PID", "OptionContent", "Answer", "PictureAddress", "Analysis"], [data[i].ID, data[i].PaperID, data[i].QuestionType, data[i].QuestionContent, data[i].QuestionIndex, data[i].Soure, data[i].PID, data[i].OptionContent, data[i].Answer, data[i].PictureAddress, data[i].Analysis], "ID=?", [data[i].ID]);
					}
				})
			}
			//存储错题与收藏数据
			function SaveErrOrColl(data) {
				SqliteServ.transaction(function(tx) {
					var len = data.length;
					for (var i = 0; i < len; i++) {
						SqliteServ.saveOrupadte(tx, 'tb_UserQuestions', ["ID", "QuestionID", "UserID", "Type", "IsSync"], [data[i].ID, data[i].QuestionID, data[i].UserID, data[i].Type, data[i].IsSync], "ID=?", [data[i].ID]);
					}
				})
			}
			//存储历史数据
			function SaveHisData(data) {
				SqliteServ.transaction(function(tx) {
					var len = data.length;
					for (var i = 0; i < len; i++) {
						SqliteServ.saveOrupadte(tx, 'tb_History', ["PaperID", "UserID", "Time", "Soure", "Content", "Type", "IsSync"], [data[i].PaperID, data[i].UserID, data[i].Time, data[i].Soure, data[i].Content, data[i].Type, data[i].IsSync], "PaperID=? and Type=?", [data[i].PaperID, data[i].Type]);
					}
				})
			}
			//存储用户信息
			function SaveAccount(data) {
				SqliteServ.transaction(function(tx) {
					var len = data.length;
					for (var i = 0; i < len; i++) {
						SqliteServ.saveOrupadte(tx, 'tb_Account', ["ID", "Name", "NickName", "IsVip", "IsLogin"], [data[i].ID, data[i].Name, data[i].NickName, data[i].IsVip, data[i].IsLogin], "ID=?", [data[i].ID]);
					}
				})
			}
			/*
			 * 数据库读取数据
			 */
			function GetExamType() {
				var q = $q.defer();
				SqliteServ.select('tb_ExamTypes', '', []).then(function(data) {
					q.resolve(data)
				})
				return q.promise;
			}
			//类型id，获取试卷
			function GetPaperList(id) {
				var q = $q.defer();
				SqliteServ.select('tb_Papers', 'ExamTypeID=?', [id]).then(function(data) {
					q.resolve(data)
				})
				return q.promise;
			}
			//试卷id，获取试卷详情
			function GetPaperData(id) {
				var q = $q.defer();
				SqliteServ.select('tb_Papers', 'PaperID=?', [id]).then(function(data) {
					q.resolve(data)
				})
				return q.promise;
			}
			//试卷id，历史类型0考试，1练习，获取试卷历史
			function GetHistoy(id) {
				var q = $q.defer();
				SqliteServ.select('tb_History', 'PaperID=?', [id]).then(function(data) {
					q.resolve(data)
				})
				return q.promise;
			}
			//试卷id，获取试题
			function GetPaperQuestions(id) {
				var q = $q.defer();
				//获取试题信息
				SqliteServ.selectfree('tb_Question', ' where PaperID=? order by PID asc,QuestionIndex asc', [id]).then(function(data) {
					q.resolve(data)
				})
				return q.promise;
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