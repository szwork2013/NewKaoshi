/*数据库服务
 * 考试类型表：
 * 类型ID、类型名、父ID
 * 试卷表：
 * 试卷ID、试卷名、考试类型ID、试卷类型ID、总分、题目数量、试卷状态（0免费，1VIP，2已下载，3更新）、合格分数、上传者ID、考试总时间、所属年份、包含题型、创建时间、创建者ID、最后更新时间、更新者ID
 * 试题表：
 * 试题ID、试卷ID、编号、联合编号、父编号、题干、序号、试题类型、分值、选项、答案、解析、版本
 * 用户表：
 * 用户ID、用户名、用户昵称、是否VIP、是否登录
 * 用户试题关联表(错题、收藏)：
 * 关联ID、类型ID、试卷ID、试题ID、用户ID、关联类型(错题、收藏)、是否已同步
 * 历史记录表：
 * 记录ID、试卷ID、用户ID、已用时间、得分、历史内容（[{ID:"1",answer:"A"},{ID:"23",answer:""}]）、考试是否确认交卷（0未交，1已交）、是否已同步
 */
commModule
	.factory('SqliteServ', ['$q', '$cordovaSQLite', '$http',
		function($q, $cordovaSQLite, $http) {
			var db = null;
			var table = [];
			if (!window.openDatabase) {
				alert('该浏览器不支持数据库');
				return false;
			} else {
				db = window.openDatabase('khddb', '1.0', 'khddb', 30000);
				var service = {
					createDB: createDB,
					transaction: transaction,
					insert: insert,
					select: select,
					selectsql:selectsql,
					selectfree: selectfree,
					saveOrupadte: saveOrupadte,
					deletehis:deletehis
				};
				return service;
			}
			//开启事务
			function transaction(callback) {
				$cordovaSQLite.transactionOpen(db, function(tx) {
					callback(tx);
				})
			}
			//查找数据
			function select(tablename, condition, param) {
				var q = $q.defer();
				var where = "";
				if (param.length > 0) {
					where = " where " + condition;
				}
				var query = "select * from " + tablename + where;
				$cordovaSQLite.execute(db, query, param).then(function(response) {
					var _length = response.rows.length;
					if (_length == 0) {
						q.resolve([]);
					} else {
						var _data = [];
						for (var i = 0; i < _length; i++) {
							_data.push(response.rows.item(i))
						}
						q.resolve(_data);
					}
				}, function(err) {
					q.reject(err); //成功返回
				});
				return q.promise;
			};
			//查找
			function selectsql(sql,param){
				var q = $q.defer();
				$cordovaSQLite.execute(db, sql, param).then(function(response) {
					var _length = response.rows.length;
					if (_length == 0) {
						q.resolve([]);
					} else {
						var _data = [];
						for (var i = 0; i < _length; i++) {
							_data.push(response.rows.item(i))
						}
						q.resolve(_data);
					}
				}, function(err) {
					q.reject(err); //成功返回
				});
				return q.promise;
			}
			//查找数据
			function selectfree(tablename, condition, param) {
				var q = $q.defer();
				var query = "select * from " + tablename +" "+ condition;
				$cordovaSQLite.execute(db, query, param).then(function(response) {
					var _length = response.rows.length;
					if (_length == 0) {
						q.resolve([]);
					} else {
						var _data = [];
						for (var i = 0; i < _length; i++) {
							_data.push(response.rows.item(i))
						}
						q.resolve(_data);
					}
				}, function(err) {
					q.reject(err); //成功返回
				});
				return q.promise;
			};
			//插入数据
			function insert(tx, tablename, field, param) {
				var q = $q.defer();
				var _length = field.length;
				var _array = []
				for (var i = 0; i < _length; i++) {
					_array.push("?");
				}
				var query = "insert into " + tablename + "(" + field.join(',') + ") values (" + _array.join(',') + ")";
				$cordovaSQLite.insetexecute(tx, query, param).then(function(response) {
					q.resolve(response);
				}, function(err) {
					q.reject(err); //成功返回
				});
				return q.promise;
			};
			//插入数据
			function insertsignal(tablename, field, param) {
				var q = $q.defer();
				var _length = field.length;
				var _array = []
				for (var i = 0; i < _length; i++) {
					_array.push("?");
				}
				var query = "insert into " + tablename + "(" + field.join(',') + ") values (" + _array.join(',') + ")";
				$cordovaSQLite.execute(db, query, param).then(function(response) {
					q.resolve(response);
				}, function(err) {
					q.reject(err); //成功返回
				});
				return q.promise;
			};
			//修改数据
			function update(tablename, field, param, condition, cparam) {
				var q = $q.defer();
				var _length = field.length;
				var _array = [];
				for (var i = 0; i < _length; i++) {
					_array.push(field[i] + "=?");
				}
				var _length = cparam.length;
				for (var i = 0; i < _length; i++) {
					param.push(cparam[i]);
				}
				var query = "update " + tablename + " set " + _array.join(",") + " where " + condition;
				$cordovaSQLite.execute(db, query, param).then(function(response) {
					q.resolve(response);
				}, function(err) {
					console.log(err.message);
					q.reject(err); //成功返回
				});
				return q.promise;
			};
			//删除数据
			function deletehis(tablename, condition, param){
				var q = $q.defer();
				var where = "";
				if (param.length > 0) {
					where = " where " + condition;
				}
				var query = "delete from " + tablename + where;
				$cordovaSQLite.execute(db, query, param).then(function(response) {
					q.resolve(response);
				}, function(err) {
					q.reject(err); //成功返回
				});
				return q.promise;
			}
			//插入或修改数据
			function saveOrupadte(tx, tablename, field, param, condition, cparam) {
				var q = $q.defer();
				select(tablename, condition, cparam).then(function(data) {
					if (data.length > 0) {
						update(tablename, field, param, condition, cparam);
					} else {
						insertsignal(tablename, field, param)
					}
				})
				return q.promise;
			};
			//创建数据库
			function createDB() {
				var q = $q.defer();
				$http.get('json/sqlite.json')
					.success(function(data, status, header, config) {
						var _length = data.length;
						for (var i = 0; i < _length; i++) {
							var query = "CREATE TABLE IF NOT EXISTS " + data[i].tableName + " (" + data[i].tablePrama.join(',') + ")";
							$cordovaSQLite.execute(db, query, []).then(function(res) {
								console.log("cerate: " + res.insertId);
							}, function(err) {
								console.error(err);
							});
						}
						//Test();

					}).error(function() {});
			};

			function Test() {
				transaction(function(tx) {
					//类型
					insert(tx, 'tb_ExamTypes', ["ExamTypeID", "ExamTypeName", "ParentID"], ['1', '财务类', '0']);
					insert(tx, 'tb_ExamTypes', ["ExamTypeID", "ExamTypeName", "ParentID"], ['2', '工程类', '0']);
					insert(tx, 'tb_ExamTypes', ["ExamTypeID", "ExamTypeName", "ParentID"], ['3', '教师类', '0']);
					insert(tx, 'tb_ExamTypes', ["ExamTypeID", "ExamTypeName", "ParentID"], ['4', '会计', '1']);
					insert(tx, 'tb_ExamTypes', ["ExamTypeID", "ExamTypeName", "ParentID"], ['5', '银行', '1']);
					insert(tx, 'tb_ExamTypes', ["ExamTypeID", "ExamTypeName", "ParentID"], ['6', '管理', '2']);
					insert(tx, 'tb_ExamTypes', ["ExamTypeID", "ExamTypeName", "ParentID"], ['7', '预算', '2']);
					insert(tx, 'tb_ExamTypes', ["ExamTypeID", "ExamTypeName", "ParentID"], ['8', '语文', '3']);
					insert(tx, 'tb_ExamTypes', ["ExamTypeID", "ExamTypeName", "ParentID"], ['9', '数学', '3']);
					insert(tx, 'tb_ExamTypes', ["ExamTypeID", "ExamTypeName", "ParentID"], ['10', '资格证', '4']);
					insert(tx, 'tb_ExamTypes', ["ExamTypeID", "ExamTypeName", "ParentID"], ['11', '入行资格', '4']);
					insert(tx, 'tb_ExamTypes', ["ExamTypeID", "ExamTypeName", "ParentID"], ['12', '高级会计', '4']);
					insert(tx, 'tb_ExamTypes', ["ExamTypeID", "ExamTypeName", "ParentID"], ['13', '柜台', '5']);
					insert(tx, 'tb_ExamTypes', ["ExamTypeID", "ExamTypeName", "ParentID"], ['14', '保险', '5']);
					insert(tx, 'tb_ExamTypes', ["ExamTypeID", "ExamTypeName", "ParentID"], ['15', '理财', '5']);
					insert(tx, 'tb_ExamTypes', ["ExamTypeID", "ExamTypeName", "ParentID"], ['16', '甲方', '6']);
					insert(tx, 'tb_ExamTypes', ["ExamTypeID", "ExamTypeName", "ParentID"], ['17', '材料', '6']);
					insert(tx, 'tb_ExamTypes', ["ExamTypeID", "ExamTypeName", "ParentID"], ['18', '核价', '7']);
					insert(tx, 'tb_ExamTypes', ["ExamTypeID", "ExamTypeName", "ParentID"], ['19', '总价', '7']);
					//错题与收藏
					insert(tx, 'tb_UserQuestions', ["ID","PaperID","QuestionID", "UserID", "Type","IsSync"], ['1', '1', '123213','','0','false']);
					insert(tx, 'tb_UserQuestions', ["ID","PaperID","QuestionID", "UserID", "Type","IsSync"], ['2', '1', '123213','','1','false']);
					insert(tx, 'tb_UserQuestions', ["ID","PaperID","QuestionID", "UserID", "Type","IsSync"], ['3', '1', '123567','','0','false']);
					insert(tx, 'tb_UserQuestions', ["ID","PaperID","QuestionID", "UserID", "Type","IsSync"], ['4', '1', '123567','','1','false']);
					insert(tx, 'tb_UserQuestions', ["ID","PaperID","QuestionID", "UserID", "Type","IsSync"], ['5', '1', '132176','','0','false']);
					insert(tx, 'tb_UserQuestions', ["ID","PaperID","QuestionID", "UserID", "Type","IsSync"], ['6', '1', '132176','','1','false']);
					insert(tx, 'tb_UserQuestions', ["ID","PaperID","QuestionID", "UserID", "Type","IsSync"], ['7', '2', '132342','','0','false']);
					insert(tx, 'tb_UserQuestions', ["ID","PaperID","QuestionID", "UserID", "Type","IsSync"], ['8', '2', '23422','','0','false']);
					
					
					//试卷
					insert(tx, 'tb_Papers', ["PaperID", "PaperContent", "ExamTypeID", "PaperTypeID", "TotalScore", "ItemNum", "UserCount", "Status", "PassMark", "UpLoaderID", "TotalTime", "Year", "ContainQuestionTypes", "CreateTime", "CreatorID", "UpdateTime", "UpdaterID"], ['1', '数学试卷', '10', '1', '100', '11', '23', '1', '60', '192.168', '150', '2016', '1|3', '2016.1.6', '192.128', '2016.1.2', '192.102']);
					insert(tx, 'tb_Papers', ["PaperID", "PaperContent", "ExamTypeID", "PaperTypeID", "TotalScore", "ItemNum", "UserCount", "Status", "PassMark", "UpLoaderID", "TotalTime", "Year", "ContainQuestionTypes", "CreateTime", "CreatorID", "UpdateTime", "UpdaterID"], ['2', '爱上大声地', '10', '2', '100', '11', '23', '0', '60', '192.168', '150', '2016', '1|3', '2016.1.6', '192.128', '2016.1.2', '192.102']);
					insert(tx, 'tb_Papers', ["PaperID", "PaperContent", "ExamTypeID", "PaperTypeID", "TotalScore", "ItemNum", "UserCount", "Status", "PassMark", "UpLoaderID", "TotalTime", "Year", "ContainQuestionTypes", "CreateTime", "CreatorID", "UpdateTime", "UpdaterID"], ['3', '阿斯顿撒', '10', '2', '100', '11', '23', '2', '60', '192.168', '150', '2016', '1|3', '2016.1.6', '192.128', '2016.1.2', '192.102']);
					insert(tx, 'tb_Papers', ["PaperID", "PaperContent", "ExamTypeID", "PaperTypeID", "TotalScore", "ItemNum", "UserCount", "Status", "PassMark", "UpLoaderID", "TotalTime", "Year", "ContainQuestionTypes", "CreateTime", "CreatorID", "UpdateTime", "UpdaterID"], ['4', '三大房贷撒', '10', '3', '100', '11', '23', '3', '60', '192.168', '150', '2016', '1|3', '2016.1.6', '192.128', '2016.1.2', '192.102']);
					insert(tx, 'tb_Papers', ["PaperID", "PaperContent", "ExamTypeID", "PaperTypeID", "TotalScore", "ItemNum", "UserCount", "Status", "PassMark", "UpLoaderID", "TotalTime", "Year", "ContainQuestionTypes", "CreateTime", "CreatorID", "UpdateTime", "UpdaterID"], ['5', '三大房贷撒', '11', '1', '100', '11', '23', '0', '60', '192.168', '150', '2016', '1|3', '2016.1.6', '192.128', '2016.1.2', '192.102']);
					insert(tx, 'tb_Papers', ["PaperID", "PaperContent", "ExamTypeID", "PaperTypeID", "TotalScore", "ItemNum", "UserCount", "Status", "PassMark", "UpLoaderID", "TotalTime", "Year", "ContainQuestionTypes", "CreateTime", "CreatorID", "UpdateTime", "UpdaterID"], ['6', '的范德萨', '11', '2', '100', '11', '23', '1', '60', '192.168', '150', '2016', '1|3', '2016.1.6', '192.128', '2016.1.2', '192.102']);
					insert(tx, 'tb_Papers', ["PaperID", "PaperContent", "ExamTypeID", "PaperTypeID", "TotalScore", "ItemNum", "UserCount", "Status", "PassMark", "UpLoaderID", "TotalTime", "Year", "ContainQuestionTypes", "CreateTime", "CreatorID", "UpdateTime", "UpdaterID"], ['7', '资的范德萨格证', '11', '3', '100', '11', '23', '2', '60', '192.168', '150', '2016', '1|3', '2016.1.6', '192.128', '2016.1.2', '192.102']);
					insert(tx, 'tb_Papers', ["PaperID", "PaperContent", "ExamTypeID", "PaperTypeID", "TotalScore", "ItemNum", "UserCount", "Status", "PassMark", "UpLoaderID", "TotalTime", "Year", "ContainQuestionTypes", "CreateTime", "CreatorID", "UpdateTime", "UpdaterID"], ['8', '二恶我说的', '11', '1', '100', '11', '23', '3', '60', '192.168', '150', '2016', '1|3', '2016.1.6', '192.128', '2016.1.2', '192.102']);
					insert(tx, 'tb_Papers', ["PaperID", "PaperContent", "ExamTypeID", "PaperTypeID", "TotalScore", "ItemNum", "UserCount", "Status", "PassMark", "UpLoaderID", "TotalTime", "Year", "ContainQuestionTypes", "CreateTime", "CreatorID", "UpdateTime", "UpdaterID"], ['9', '我问问去啊', '10', '1', '100', '11', '23', '0', '60', '192.168', '150', '2016', '1|3', '2016.1.6', '192.128', '2016.1.2', '192.102']);
					insert(tx, 'tb_Papers', ["PaperID", "PaperContent", "ExamTypeID", "PaperTypeID", "TotalScore", "ItemNum", "UserCount", "Status", "PassMark", "UpLoaderID", "TotalTime", "Year", "ContainQuestionTypes", "CreateTime", "CreatorID", "UpdateTime", "UpdaterID"], ['10', '打发士大夫', '12', '1', '100', '11', '23', '1', '60', '192.168', '150', '2016', '1|3', '2016.1.6', '192.128', '2016.1.2', '192.102']);
					insert(tx, 'tb_Papers', ["PaperID", "PaperContent", "ExamTypeID", "PaperTypeID", "TotalScore", "ItemNum", "UserCount", "Status", "PassMark", "UpLoaderID", "TotalTime", "Year", "ContainQuestionTypes", "CreateTime", "CreatorID", "UpdateTime", "UpdaterID"], ['11', '是打发第三方', '12', '3', '100', '11', '23', '2', '60', '192.168', '150', '2016', '1|3', '2016.1.6', '192.128', '2016.1.2', '192.102']);
					insert(tx, 'tb_Papers', ["PaperID", "PaperContent", "ExamTypeID", "PaperTypeID", "TotalScore", "ItemNum", "UserCount", "Status", "PassMark", "UpLoaderID", "TotalTime", "Year", "ContainQuestionTypes", "CreateTime", "CreatorID", "UpdateTime", "UpdaterID"], ['12', '呈现出向周星驰', '12', '3', '100', '11', '23', '3', '60', '192.168', '150', '2016', '1|3', '2016.1.6', '192.128', '2016.1.2', '192.102']);
					insert(tx, 'tb_Papers', ["PaperID", "PaperContent", "ExamTypeID", "PaperTypeID", "TotalScore", "ItemNum", "UserCount", "Status", "PassMark", "UpLoaderID", "TotalTime", "Year", "ContainQuestionTypes", "CreateTime", "CreatorID", "UpdateTime", "UpdaterID"], ['13', '子现场走心辞职信', '12', '2', '100', '11', '23', '0', '60', '192.168', '150', '2016', '1|3', '2016.1.6', '192.128', '2016.1.2', '192.102']);
					insert(tx, 'tb_Papers', ["PaperID", "PaperContent", "ExamTypeID", "PaperTypeID", "TotalScore", "ItemNum", "UserCount", "Status", "PassMark", "UpLoaderID", "TotalTime", "Year", "ContainQuestionTypes", "CreateTime", "CreatorID", "UpdateTime", "UpdaterID"], ['14', '自行车自行车', '13', '1', '100', '11', '23', '1', '60', '192.168', '150', '2016', '1|3', '2016.1.6', '192.128', '2016.1.2', '192.102']);
					insert(tx, 'tb_Papers', ["PaperID", "PaperContent", "ExamTypeID", "PaperTypeID", "TotalScore", "ItemNum", "UserCount", "Status", "PassMark", "UpLoaderID", "TotalTime", "Year", "ContainQuestionTypes", "CreateTime", "CreatorID", "UpdateTime", "UpdaterID"], ['15', '自行车自行车在', '13', '2', '100', '11', '23', '2', '60', '192.168', '150', '2016', '1|3', '2016.1.6', '192.128', '2016.1.2', '192.102']);
					//试题
					insert(tx, 'tb_Question', ["id", "paperId", "c_key", "q_key","pq_key",  "questionContent", "questionIndex", "questionType", "soure","optionContent","answer","analysis","version"], ['123213', '1', '一','一','', '判断题','0','checking','1','{}','','','0']);
					insert(tx, 'tb_Question', ["id", "paperId", "c_key", "q_key","pq_key",  "questionContent", "questionIndex", "questionType", "soure","optionContent","answer","analysis","version"], ['123567', '1', '1','一1','一','阿斯顿撒旦', '0','checking','1','{"A":"对","B":"错"}','错','无','0']);
					insert(tx, 'tb_Question', ["id", "paperId", "c_key", "q_key","pq_key",  "questionContent", "questionIndex", "questionType", "soure","optionContent","answer","analysis","version"], ['132176', '1', '2','一2','一','萨达萨达','1', 'checking','1','{"A":"对","B":"错"}','错','无','0']);
					insert(tx, 'tb_Question', ["id", "paperId", "c_key", "q_key","pq_key",  "questionContent", "questionIndex", "questionType", "soure","optionContent","answer","analysis","version"], ['321345', '1', '3','一3','一','的方法都试','2','checking','1','{"A":"对","B":"错"}', '对','无','0']);
					insert(tx, 'tb_Question', ["id", "paperId", "c_key", "q_key","pq_key",  "questionContent", "questionIndex", "questionType", "soure","optionContent","answer","analysis","version"], ['322234', '1', '4','一4','一','阿大声道','3','checking','1','{"A":"对","B":"错"}','错','无','0' ]);
					insert(tx, 'tb_Question', ["id", "paperId", "c_key", "q_key","pq_key",  "questionContent", "questionIndex", "questionType", "soure","optionContent","answer","analysis","version"], ['232343', '1', '二','二','','单选题','1','singleChoice','2','{}', '','','0']);
					insert(tx, 'tb_Question', ["id", "paperId", "c_key", "q_key","pq_key",  "questionContent", "questionIndex", "questionType", "soure","optionContent","answer","analysis","version"], ['343221', '1', '5','二5','二','问问企鹅王企鹅额外去','0','singleChoice','2','{"A":"萨达","B":"请问","C":"萨达杀手","D":"规范风格的"}','A','无','0']);
					insert(tx, 'tb_Question', ["id", "paperId", "c_key", "q_key","pq_key",  "questionContent", "questionIndex", "questionType", "soure","optionContent","answer","analysis","version"], ['342342', '1', '6','二6','二','网额外企鹅完全','1','singleChoice','2','{"A":"萨达","B":"请问","C":"萨达杀手","D":"规范风格的"}','C','无','0']);
					insert(tx, 'tb_Question', ["id", "paperId", "c_key", "q_key","pq_key",  "questionContent", "questionIndex", "questionType", "soure","optionContent","answer","analysis","version"], ['232232', '1', '7','二7','二','网额孤鸿寡鹄','2','singleChoice','2','{"A":"萨达","B":"请问","C":"萨达杀手","D":"规范风格的"}','A','无','0']);
					insert(tx, 'tb_Question', ["id", "paperId", "c_key", "q_key","pq_key",  "questionContent", "questionIndex", "questionType", "soure","optionContent","answer","analysis","version"], ['432322', '1', '8','二8','二','同一条也太容易','3','singleChoice','2','{"A":"萨达","B":"请问","C":"萨达杀手","D":"规范风格的"}','B','无','0']);
					insert(tx, 'tb_Question', ["id", "paperId", "c_key", "q_key","pq_key",  "questionContent", "questionIndex", "questionType", "soure","optionContent","answer","analysis","version"], ['234234', '1', '三','三','','案例题','2','singleChoice','2','{}','','','0']);
					insert(tx, 'tb_Question', ["id", "paperId", "c_key", "q_key","pq_key",  "questionContent", "questionIndex", "questionType", "soure","optionContent","answer","analysis","version"], ['212311', '1', '(一)','三(一)','三','爱上大声地','0','singleChoice','2','{}','','','0']);
					insert(tx, 'tb_Question', ["id", "paperId", "c_key", "q_key","pq_key",  "questionContent", "questionIndex", "questionType", "soure","optionContent","answer","analysis","version"], ['312321', '1', '9', '三(一)9','三(一)','额为全文','0','singleChoice','2','{"A":"萨达","B":"请问","C":"萨达杀手","D":"规范风格的"}','D','无','0']);
					insert(tx, 'tb_Question', ["id", "paperId", "c_key", "q_key","pq_key",  "questionContent", "questionIndex", "questionType", "soure","optionContent","answer","analysis","version"], ['453541', '1', '10','三(一)10', '三(一)','额外企鹅完全','1','singleChoice','2','{"A":"萨达","B":"请问","C":"萨达杀手","D":"规范风格的"}','C','无','0']);
					insert(tx, 'tb_Question', ["id", "paperId", "c_key", "q_key","pq_key",  "questionContent", "questionIndex", "questionType", "soure","optionContent","answer","analysis","version"], ['565611', '1', '11','三(一)11','三(一)','梵蒂冈的非官方个','2','singleChoice','2','{"A":"萨达","B":"请问","C":"萨达杀手","D":"规范风格的"}','C','无','0']);
					insert(tx, 'tb_Question', ["id", "paperId", "c_key", "q_key","pq_key",  "questionContent", "questionIndex", "questionType", "soure","optionContent","answer","analysis","version"], ['456645', '1', '12','三(一)12','三(一)','打算放四大','3','singleChoice','2','{"A":"萨达","B":"请问","C":"萨达杀手","D":"规范风格的"}', 'B','无','0']);
					insert(tx, 'tb_Question', ["id", "paperId", "c_key", "q_key","pq_key",  "questionContent", "questionIndex", "questionType", "soure","optionContent","answer","analysis","version"], ['567554', '1', '13','三(一)13','三(一)','撒的发生的','4','singleChoice','2','{"A":"萨达","B":"请问","C":"萨达杀手","D":"规范风格的"}','A','无','0']);
					insert(tx, 'tb_Question', ["id", "paperId", "c_key", "q_key","pq_key",  "questionContent", "questionIndex", "questionType", "soure","optionContent","answer","analysis","version"], ['345435', '1', '(二)','三(二)','三','撒打算','1','mutepliChoice','4','{}','','','0']);
					insert(tx, 'tb_Question', ["id", "paperId", "c_key", "q_key","pq_key",  "questionContent", "questionIndex", "questionType", "soure","optionContent","answer","analysis","version"], ['345341', '1', '14','三(二)14','三(二)','额外热舞二玩儿','0','mutepliChoice','4','{"A":"萨达","B":"请问","C":"萨达杀手","D":"规范风格的"}','AB','无','0']);
					insert(tx, 'tb_Question', ["id", "paperId", "c_key", "q_key","pq_key",  "questionContent", "questionIndex", "questionType", "soure","optionContent","answer","analysis","version"], ['453452', '1', '15','三(二)15','三(二)','的发个梵蒂冈','1','mutepliChoice','4','{"A":"萨达","B":"请问","C":"萨达杀手","D":"规范风格的"}','BD','无','0']);
					insert(tx, 'tb_Question', ["id", "paperId", "c_key", "q_key","pq_key",  "questionContent", "questionIndex", "questionType", "soure","optionContent","answer","analysis","version"], ['435345', '1', '16','三(二)16', '三(二)','用户体验','2','mutepliChoice','4','{"A":"萨达","B":"请问","C":"萨达杀手","D":"规范风格的"}','BC','无','0']);
					insert(tx, 'tb_Question', ["id", "paperId", "c_key", "q_key","pq_key",  "questionContent", "questionIndex", "questionType", "soure","optionContent","answer","analysis","version"], ['435347', '1', '17','三(二)17','三(二)','个头发的股份的','3','mutepliChoice','4','{"A":"萨达","B":"请问","C":"萨达杀手","D":"规范风格的"}','CD','无','0']);
					
				})
			}

			/*function GetMessages(SendID, ReceiveID) {
				var q = $q.defer();
				SendID = SendID.toString();
				ReceiveID = ReceiveID.toString();
				select("Messages", "(SendID=? and ReceiveID=?) or (SendID=? and ReceiveID=?) ", [SendID, ReceiveID, ReceiveID, SendID]).then(function(data) {
					q.resolve(data)
				})
				return q.promise;
			};

			function AddMessages(item) {
				var q = $q.defer();
				item.ReceiveID = item.ReceiveID.toString();
				item.SendID = item.SendID.toString();
				insert("Messages", ["SendID", "Img", "Content","AudioTime","Type","Time", "ReceiveID"], [item.SendID, item.Img, item.Content,item.AudioTime,item.Type, item.Time, item.ReceiveID]).then(function(data) {
					q.resolve(data)
				})
				return q.promise;
			};

			function AddContacts(item) {
				var q = $q.defer();
				item.ID = item.ID.toString();
				var filed = ["ID", "Img", "Account", "Name", "NickName", "Address", "IsCurrent", "CurrentContent", "CurrentTime"];
				var param = [item.ID, item.Img, item.Account, item.Name, item.NickName, item.Address, false, "", ""];
				var condition = "ID=?";
				var cparam = [item.ID];
				saveOrupadte("Contacts", filed, param, condition, cparam).then(function(data) {
					q.resolve(data)
				})
				return q.promise;
			};
		
			function GetContacts(IsCurrent) {
				var q = $q.defer();
				var _filed = "";
				var _prarm = [];
				if (IsCurrent) {
					_filed = "IsCurrent=?";
					_prarm = [true];
				}
				select("Contacts", _filed, _prarm).then(function(data) {
					q.resolve(data)
				})
				return q.promise;
			};

			function UpdateContacts(item) {
				var q = $q.defer();
				item.ID = item.ID.toString();
				var filed = [];
				var param = [];
				for (var o in item) {
					filed.push(o);
					param.push(item[o]);
				}
				var condition = "ID=?";
				var cparam = [item.ID];
				update("Contacts", filed, param, condition, cparam).then(function(data) {
					if (data.rowsAffected == 1) {
						q.resolve(true);
					} else {
						q.reject(false);
					}

				})
				return q.promise;
			};*/
		}
	]);