commModule
	.factory("DataServ", ['$http', '$q', 'SqliteServ',
		function($http, $q, SqliteServ) {
			var baseurl = 'http://p14600968p.imwork.net/kaohaodian/api/';
			var database;
			var server = {
				InitDataBase: InitDataBase,

				PostExamTypes: PostExamTypes, //请求考试类型
				PostExamPaper: PostExamPaper, //请求试卷
				PostQuestions: PostQuestions, //请求试题
				PostLogin: PostLogin, //登录
				PostRegister: PostRegister, //注册
				PostQuestionPic: PostQuestionPic, //请求图片
				PostUpdatePsd:PostUpdatePsd,//修改密码
				PostUpdateVip:PostUpdateVip,//注册VIP

				MarkExamEnd: MarkExamEnd, //更改试卷考试状态
				BaseUpdate: BaseUpdate,
				BaseSaveUpdate: BaseSaveUpdate,

				GetExamType: GetExamType,
				GetPaperData: GetPaperData,
				GetHistoy: GetHistoy,
				GetPaperQuestions: GetPaperQuestions,
				GetErrorData: GetErrorData,
				GetCollectData: GetCollectData,
				GetExamName: GetExamName,
				GetQuestionData: GetQuestionData,
				BaseSelect: BaseSelect,

				SaveErrOrColl: SaveErrOrColl, //存储错题
				CollectQuestion:CollectQuestion,//收藏
				CancelCollect:CancelCollect,//取消收藏
				UpdatePaperStatus: UpdatePaperStatus, //修改试卷状态
				DeletPaperHistory: DeletPaperHistory
			}
			return server;

			function InitDataBase() {
				if (database == null) {
					database = new DataBase();
				}
				if (database.db == null) {
					database.OpenTransaction(function(tx) {
						database.InitDB(tx);
					})

				}
			}
			/*
			 * 服务器数据请求
			 */
			//获取所有数据（考试类型、试卷）
			function PostExamTypes() {
				var q = $q.defer();
				/*var parma={
					reqTimestamp: Date.parse(new Date()),
					reqCode:'khd_app',
					reqSign:''
				}
				parma.reqSign=MD5(parma.reqTimestamp+parma.reqCode+'0123456789qwertyuiop');*/
				BasePost('getExamTypes.do').then(function(response) {
					if (response.status == "success") {
						SaveExamType(response.data);
					}
					q.resolve(response);
				})
				return q.promise;
			}
			//获取试卷
			function PostExamPaper(typeid) {
				var q = $q.defer();
				var parma = {
					//examTypeId:typeid
					examTypeId: '4028188154ce38b40154ce3cc6690002'
				}
				BasePost('getExamPapers.do').then(function(response) {
					if (response.status == "success") {
						SavePaper(response.data)
						q.resolve(response);
					} else {
						console.log("请求试卷失败:" + response.msg)
					}

				})
				return q.promise;
			}
			//获取历史数据
			function PostHisData() {

			}
			//试卷id，获取试题
			function PostQuestions(paperid) {
				var q = $q.defer();
				var parma = {
					paperId: paperid
				}
				BasePost('getExamQuestionsByPaper.do', parma).then(function(response) {
					if (response.status == "success") {
						SaveQuestion(response.data)
						q.resolve(response.data);
					} else {
						q.reject(response.msg)
						console.log("请求试题失败:" + response.msg)
					}

				},function(err){
					q.reject(err);
				})
				return q.promise;
			}

			function PostLogin(name, pwd) {
				var q = $q.defer();
				var parma = {
					name: name,
					pwd: pwd
				}
				BasePost('validateUser.do', parma).then(function(response) {
					if (response.status == "success") {
						SaveAccount(response.data)
						q.resolve(response.data);
					} else {
						q.reject(response.msg);
					}

				})
				return q.promise;
			}

			function PostRegister(name, nickname, pwd, email) {
				var q = $q.defer();
				var parma = {
					name: name,
					pwd: pwd,
					nickName: nickname,
					email: email
				}
				BasePost('userRegister.do', parma).then(function(response) {
					if (response.status == "success") {
						q.resolve(response);
					} else {
						q.reject(response.msg);
					}

				})
				return q.promise;
			}
			//请求图片
			function PostQuestionPic(placeid) {
				var q = $q.defer();
				var parma = {
					placeId: placeid
				}
				BasePost('getQuestionPic.do', parma).then(function(response) {
					if (response.status == "success") {
						//SaveAccount(response.data)
						console.log(response.data)
						q.resolve(response.data);
					} else {
						q.reject(response.msg);
					}

				})
				return q.promise;
			}
			function PostUpdatePsd(oldpsd,newpsd){
				var q = $q.defer();
				var userinfo=JSON.parse(localStorage.getItem("userInfo"));
				var parma = {
					userId: userinfo.id,
					newPwd:newpsd,
					oldPwd:oldpsd
				}
				BasePost('changeUserPwd.do', parma).then(function(response) {
					if (response.status == "success") {
						//SaveAccount(response.data)
						console.log(response.data)
						q.resolve(response.data);
					} else {
						q.reject(response.msg);
					}

				})
				return q.promise;
			}
			function PostUpdateVip(num){
				var q = $q.defer();
				var userinfo=JSON.parse(localStorage.getItem("userInfo"));
				var parma = {
					id: userinfo.id,
					activationCode:num
				}
				BasePost('relateActivationCode.do', parma).then(function(response) {
					if (response.status == "success") {
						//SaveAccount(response.data)
						console.log(response.data)
						q.resolve(response.data);
					} else {
						q.reject(response.msg);
					}

				})
				return q.promise;
			}

			function BasePost(url, parma) {
				var q = $q.defer();
				$http({
					method: 'POST',
					url: baseurl + url,
					params: parma,
					timeout:10000,//请求超时10秒
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded:charset=utf-8'
					}
				}).success(function(response) {
					q.resolve(response);
				}).error(function(error) {
					q.reject(error)
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
				database.OpenTransaction(function(tx) {
					var len = data.length;
					for (var i = 0; i < len; i++) {
						database.SaveOrUpdateTable(tx, 'tb_ExamTypes', ["ExamTypeID", "ExamTypeName", "ParentID"], [data[i].id, data[i].name, data[i].pid], "ExamTypeID", [data[i].id]);
					}
				})
			}
			//存储试卷数据
			function SavePaper(data) {
				SqliteServ.selectsql("select * from tb_Papers").then(function(jsondata) {
					if (jsondata && jsondata.length > 0) {
						var length = jsondata.length;
						var len = data.length;
						for (var j = 0; j < length; j++) {
							for (var k = 0; k < len; k++) {
								if (data[k].id == jsondata[j].PaperID) {
									if (data[k].updateTime != jsondata[j].UpdateTime) {
										data[k].Status = "3";
									} else if (jsondata[j].Status == "2") {
										data[k].Status = "2";
									}
								}
							}
						}
					}
					database.OpenTransaction(function(tx) {
						var lena = data.length;
						for (var i = 0; i < lena; i++) {
							database.SaveOrUpdateUerRoleTable(tx, 'tb_Papers', ["PaperID", "PaperContent", "ExamTypeID", "PaperTypeID", "TotalScore", "ItemNum", "UserCount", "Status", "PassMark", "UpLoaderID", "TotalTime", "Year", "ContainQuestionTypes", "CreateTime", "CreatorID", "UpdateTime", "UpdaterID"], [data[i].id, data[i].name, data[i].examTypeId, data[i].paperTypeId, data[i].totalScore, data[i].itemNum, data[i].useCount, data[i].isVIP, data[i].passmark, data[i].uploaderId, data[i].totalTime, data[i].year, data[i].containQustionTypes, data[i].createTime, data[i].creator, data[i].updateTime, data[i].uploaderId], "PaperID=?", [data[i].id]);
						}
					})
				})

			}
			//存储试题数据
			function SaveQuestion(data) {
				database.OpenTransaction(function(tx) {
					var len = data.length;
					for (var i = 0; i < len; i++) {
						database.SaveOrUpdateTable(tx, 'tb_Question', ["id", "paperId", "c_key", "q_key", "pq_key", "questionContent", "questionIndex", "questionType", "soure", "optionContent", "answer", "analysis", "version"], [data[i].id, data[i].paperId, data[i].c_key, data[i].q_key, data[i].pq_key, data[i].questionContent, data[i].questionIndex, data[i].questionType, data[i].soure, JSON.stringify(data[i].optionContent), data[i].answer, data[i].analysis, data[i].version], "id", [data[i].id]);
					}
				})
			}
			//存储错题与收藏数据
			function SaveErrOrColl(data) {
				database.OpenTransaction(function(tx) {
					var len = data.length;
					for (var i = 0; i < len; i++) {
						database.SaveOrUpdateUerRoleTable(tx, 'tb_UserQuestions', ["PaperID", "QuestionID", "UserID", "Type", "IsSync"], [data[i].PaperID, data[i].QuestionID, data[i].UserID, data[i].Type, data[i].IsSync], "PaperID=? and QuestionID=?", [data[i].PaperID, data[i].QuestionID]);
					}
				})
			}

			function MarkExamEnd(paperid) {
				database.OpenTransaction(function(tx) {
					database.SaveOrUpdateUerRoleTable(tx, 'tb_History', ["IsEnd"], [1], "PaperID=? and Type=?", [paperid, 0]);
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

			function UpdatePaperStatus(id) {
				var q = $q.defer();
				SqliteServ.update('tb_Papers', ['Status'], ['2'], "PaperID=?", [id]).then(function(res) {
					q.resolve(res);
				})
				return q.promise
			}
			//收藏
			function CollectQuestion(item){
				var userinfo=JSON.parse(localStorage.getItem("userInfo"));
				var userid='';
				if(userinfo && userinfo.id){
					userid=userinfo.id
				}
				database.OpenTransaction(function(tx) {
					database.SaveOrUpdateUerRoleTable(tx, 'tb_UserQuestions', ["PaperID","QuestionID", "UserID", "Type","IsSync"], [item.paperId,item.id,userid,'1','0'], "PaperID=? and QuestionID=?", [item.paperId,item.id]);
				})
			}
			//取消收藏
			function CancelCollect(item){
				var q = $q.defer();
				SqliteServ.deletehis('tb_UserQuestions', 'PaperID=? and QuestionID=?', [item.paperId,item.id]).then(function(response) {
					q.resolve(response)
				})
				return q.promise;
			}

			function BaseUpdate(tablename, field, param, condition, cparam) {
				var q = $q.defer();
				SqliteServ.update(tablename, field, param, condition, cparam).then(function(res) {
					q.resolve(res);
				})
				return q.promise;
			}

			function BaseSaveUpdate(tablename, field, param, condition, cparam) {

				var q = $q.defer();
				SqliteServ.saveOrupadte(tablename, field, param, condition, cparam).then(function(res) {
					q.resolve(res);
				})
				return q.promise;
			}
			/*
			 * 数据库读取数据
			 */
			function GetExamType() {
				var q = $q.defer();
				SqliteServ.select('tb_ExamTypes', 'ParentID is null', []).then(function(data) {
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
			function GetHistoy(id, type) {
				var q = $q.defer();
				if (type == null) {
					SqliteServ.select('tb_History', 'PaperID=? ', [id]).then(function(data) {
						q.resolve(data)
					})
				} else {
					SqliteServ.select('tb_History', 'PaperID=? and Type=?', [id, type]).then(function(data) {
						q.resolve(data)
					})
				}

				return q.promise;
			}
			//试卷id，获取试题
			function GetPaperQuestions(id) {
				var q = $q.defer();
				//获取试题信息
				SqliteServ.selectfree('tb_Question', "where paperId=? order by (case q_key when '一' then 1 when '二' then 2 when '三' then 3 when '四' then 4 when '五' then 5 when '六' then 6 when '七' then 7 when '八' then 8 when '九' then 9 else '' end)", [id]).then(function(data) {
					q.resolve(data)
				})
				return q.promise;
			}
			//无参数，用于获取广告图
			function GetHomeData() {

			}
			//用于错题
			function GetErrorData() {
				var q = $q.defer();
				SqliteServ.selectsql('select *,count(QuestionID) as rows from tb_UserQuestions join tb_Papers on tb_UserQuestions.PaperID = tb_Papers.PaperID where  Type=? group by tb_UserQuestions.PaperID', [0]).then(function(data) {
					q.resolve(data)
				})
				return q.promise;
			}
			//用于收藏
			function GetCollectData() {
				var q = $q.defer();
				SqliteServ.selectsql('select *,count(QuestionID) as rows from tb_UserQuestions join tb_Papers on tb_UserQuestions.PaperID = tb_Papers.PaperID where  Type=? group by tb_UserQuestions.PaperID', ['1']).then(function(data) {
					q.resolve(data)
				})
				return q.promise;
			}
			//获取考试类型
			function GetExamName() {
				var q = $q.defer();
				SqliteServ.selectsql('select * from tb_ExamTypes where ExamTypeID in (select ExamTypeID from tb_UserQuestions join tb_Papers on tb_UserQuestions.PaperID = tb_Papers.PaperID group by tb_Papers.ExamTypeID)', []).then(function(data) {
					q.resolve(data)
				})
				return q.promise;
			}
			//获取试题
			function GetQuestionData(paperid, type) {
				var q = $q.defer();
				SqliteServ.selectsql('select * from tb_Question where id in (select QuestionID from tb_UserQuestions where PaperID=? and Type=?)', [paperid, type]).then(function(data) {
					q.resolve(data)
				})
				return q.promise;
			}

			function BaseSelect(sql, parma) {
				var q = $q.defer();
				SqliteServ.selectsql(sql, parma).then(function(data) {
					q.resolve(data)
				})
				return q.promise;
			}
			/*
			 * 
			 */
			function DeletPaperHistory(paperid) {
				var q = $q.defer();
				SqliteServ.deletehis('tb_History', 'PaperID=? and Type=? and IsEnd=?', [paperid, 0, 1]).then(function(response) {
					q.resolve(response)
				})
				return q.promise;
			}

		}
	])