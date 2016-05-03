//本地数据库处理
/**
 *数据库操作辅助类,定义对象、数据操作方法都在这里定义
 */
var DataBase = function() {
	this.options = {
		dbname: 'khddb',
		version: '1.0',
		dbdesc: 'khddb',
		dbsize: 30000,
		db: null,
		//考试类型：类型ID、类型名、父ID
		table_ExamTypes: 'tb_ExamTypes',
		ExamTypes: ['ExamTypeID', 'ExamTypeName', 'ParentID'],
		
		//试卷表：试卷ID、考试类型ID、试卷类型ID、总分、题目数量、是否VIP、是否下载、合格分数、上传者ID、考试总时间、所属年份、包含题型、创建时间、创建者ID、最后更新时间、更新者ID、描述
		table_Papers: 'tb_Papers',
		Papers: ['PaperID', 'ExamTypeID', 'PaperTypeID', 'TotalScore', 'ItemNum', 'UserCount', 'IsVip','IsDownLoad', 'PassMark', 'UpLoaderID', 'TotalTime', 'Year','ContainQuestionTypes','CreateTime','CreatorID','UpdateTime','UpdaterID','Dec'],
		
		//试题表：试题ID、试卷ID、题干、题型、序号、分数、父节点ID、选项内容、参考答案、图片地址、答案解析
		table_Question: 'tb_Question',
		Question: ['ID', 'PaperID', 'QuestionContent', 'QuestionIndex', 'Soure', 'PID', 'OptionContent', 'Answer', 'PictureAddress','Analysis'],

		//用户表：用户ID、用户名、用户昵称、是否VIP、是否登录
		table_Account: 'tb_Account',
		Account: ['ID', 'Name', 'NickName', 'IsVip','IsLogin'],

		//用户试题关联表：关联ID、试题ID、用户ID、关联类型(错题、收藏)、是否已同步
		table_UserQuestions: 'tb_UserQuestions',
		UserQuestions: ['ID', 'QuestionID', 'UserID', 'Type','IsSync'],
		
		//历史记录表：记录ID、试卷ID、用户ID、已用时间、得分、历史内容（[{ID:"1",answer:"A"},{ID:"23",answer:""}]）、是否已同步
		table_History: 'tb_History',
		History: ['ID', 'PaperID', 'UserID', 'Time', 'Soure', 'Content','IsSync'],
	}
}
DataBase.prototype = {
	OpenDB: function(callback) {
		try {
			if (!window.openDatabase) {
				alert('该浏览器不支持数据库');
				return false;
			}
			this.options.db = window.openDatabase(this.options.dbname, this.options.version, this.options.dbdesc, this.options.dbsize);
			return true;
		} catch (e) {
			if (e == 2) {
				alert("数据库版本无效");
			} else {
				alert("数据库未知错误 " + e + ".");
			}
			alert("数据库错误" + e.message);
			return false;
		}
	},
	ExecSql: function(tx, sql, param, callback) {
		tx.executeSql(sql, param, function(tx, result) {
			if (typeof(callback) == 'function') {
				callback(true);
			}
			return true;
		}, function(tx, error) {
			console.log(error)
			if (typeof(callback) == 'function') {
				callback(false);
			}
			return false;
		});
	},
	InitDB: function(tx) {
		if (this.options.db == null) {
			this.OpenDB();
		}
		this.CreateTable(tx, this.options.table_ExamTypes, this.options.ExamTypes, {
			"ExamTypeID": "primary key",
			"app_flow_no": "not null"
		});
		this.CreateTable(tx, this.options.table_Papers, this.options.Papers, {
			"PaperID": "primary key",
			"app_flow_no": "not null"
		});
		this.CreateTable(tx, this.options.table_Question, this.options.Question, {
			"ID": "INTEGER",
			"app_flow_no": "not null"
		});
		this.CreateTable(tx, this.options.table_Account, this.options.Account, {
			"ID": "INTEGER primary key",
			"app_flow_no": "not null"
		});
		this.CreateTable(tx, this.options.table_UserQuestions, this.options.UserQuestions, {
			"ID": "INTEGER primary key",
			"app_flow_no": "not null"
		});
		this.CreateTable(tx, this.options.table_History, this.options.History, {
			"ID": "INTEGER primary key",
			"app_flow_no": "not null"
		});
	
	},
	CreateTable: function(tx, tableName, fields, constraint) {

		if (this.options.db == null) {
			this.OpenDB();
		}
		var sql = 'CREATE TABLE IF NOT EXISTS ' + tableName + ' (';
		for (i in fields) {
			var key = "";
			if (typeof(constraint) != "undefined" && typeof(constraint[fields[i]]) != "undefined") {
				key = " " + constraint[fields[i]];
			}
			sql += fields[i] + key + ",";
		}
		sql = sql.substr(0, sql.length - 1);
		sql += ")";
		//log(sql);
		this.ExecSql(tx, sql);
	},
	UpdateTable: function(tx, tableName, setFields, setParams, whereStr, wherParams, callback) {
		var sql = "update " + tableName + " set ";
		for (i in setFields) {
			sql += setFields[i] + "=?,";
		}
		sql = sql.substr(0, sql.length - 1);
		if (typeof(whereStr) != "undefined" && typeof(wherParams) != "undefined" && whereStr != "") {
			sql += " where " + whereStr;
			setParams = setParams.concat(wherParams);
		}
		this.ExecSql(tx, sql, setParams, callback);
	},
	InsertTable: function(tx, tableName, insertFields, insertParams, callback) {
		var sql = "insert into " + tableName + " (";
		var sql2 = " values(";
		for (i in insertFields) {
			sql += insertFields[i] + ",";
			sql2 += "?,"
		}
		sql = sql.substr(0, sql.length - 1);
		sql2 = sql2.substr(0, sql2.length - 1);
		sql += ")";
		sql2 += ")";
		if (typeof(callback) == 'function')
			this.ExecSql(tx, sql + sql2, insertParams, callback);
		else
			this.ExecSql(tx, sql + sql2, insertParams);
	},
	DeleteTable: function(tx, tableName, whereStr, wherParams, callback) {
		var sql = "delete from " + tableName;
		if (typeof(whereStr) != "undefined" && typeof(wherParams) != "undefined" && whereStr != "") {
			sql += " where " + whereStr;
		}
		this.ExecSql(tx, sql, wherParams, callback);
	},
	DropTable: function(tx, tableName, callback) {
		var sql = 'DROP TABLE IF EXISTS ' + tableName;
		if (typeof(whereStr) != "undefined" && typeof(wherParams) != "undefined" && whereStr != "") {
			sql += " where " + whereStr;
		}
		this.ExecSql(tx, sql, [], callback);
	},
	//@sql:"select * from tb_UserMessage join tb_FrontUsers on tb_UserMessage.UserID=tb_FrontUsers.UserID where UserID=? order by UserID DESC"
	SelectTable: function(tx, sql, wherParams, callback,params) {
		tx.executeSql(sql, wherParams, function(tx, result) {
			if (result.rows.length < 1) {
				if (typeof(callback) == 'function') {
					callback(false,params);
				}
			} else {
				if (typeof(callback) == 'function') {
					callback(result.rows,params);
				}
			}
			return true;
		}, function(tx, error) {
			return false;
		});
	},
	SaveOrUpdateTable: function(tx, tableName, insertFields, insertParams, key, keyVal, callback) {
		var me = this;
		if (typeof(key) != "undefined" && typeof(keyVal) != "undefined" && key != "") {
			var sql = "SELECT " + insertFields[0] + " FROM " + tableName;
			if (typeof(key) != "undefined" && typeof(keyVal) != "undefined" && key != "") {
				sql += " where " + key + "=?";
			}
			me.SelectTable(tx, sql, [keyVal], function(rows) {
				if (rows) {
					me.UpdateTable(tx, tableName, insertFields, insertParams, key + "=?", [keyVal], callback);
				} else {
					insertFields.push(key);
					insertParams.push(keyVal);
					me.InsertTable(tx, tableName, insertFields, insertParams, callback);
				}
			})
		} else {
			me.InsertTable(tx, tableName, insertFields, insertParams, callback);
		}
	},
	//添加一个事务
	OpenTransaction: function(callback) {
		if (this.options.db == null) {
			this.OpenDB();
		}
		this.options.db.transaction(function(tx) {
			callback(tx); //执行数据操作
		})
	},
	
}