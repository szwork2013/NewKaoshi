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
				select:select
			};
			return service;
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
		//插入数据
		function insert(tablename, field, param) {
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
		//插入或修改数据
		function saveOrupadte(tablename, field, param, condition, cparam) {
			var q = $q.defer();
			select(tablename, condition, cparam).then(function(data) {
				if (data.length > 0) {
					update(tablename, field, param, condition, cparam);
				} else {
					insert(tablename, field, param)
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
		function Test(){
			//类型
			insert('tb_ExamTypes',["ExamTypeID", "ExamTypeName", "ParentID"],['1','财务类','0']);
			insert('tb_ExamTypes',["ExamTypeID", "ExamTypeName", "ParentID"],['2','工程类','0']);
			insert('tb_ExamTypes',["ExamTypeID", "ExamTypeName", "ParentID"],['3','教师类','0']);
			insert('tb_ExamTypes',["ExamTypeID", "ExamTypeName", "ParentID"],['4','会计','1']);
			insert('tb_ExamTypes',["ExamTypeID", "ExamTypeName", "ParentID"],['5','银行','1']);
			insert('tb_ExamTypes',["ExamTypeID", "ExamTypeName", "ParentID"],['6','管理','2']);
			insert('tb_ExamTypes',["ExamTypeID", "ExamTypeName", "ParentID"],['7','预算','2']);
			insert('tb_ExamTypes',["ExamTypeID", "ExamTypeName", "ParentID"],['8','语文','3']);
			insert('tb_ExamTypes',["ExamTypeID", "ExamTypeName", "ParentID"],['9','数学','3']);
			insert('tb_ExamTypes',["ExamTypeID", "ExamTypeName", "ParentID"],['10','资格证','4']);
			insert('tb_ExamTypes',["ExamTypeID", "ExamTypeName", "ParentID"],['11','入行资格','4']);
			insert('tb_ExamTypes',["ExamTypeID", "ExamTypeName", "ParentID"],['12','高级会计','4']);
			insert('tb_ExamTypes',["ExamTypeID", "ExamTypeName", "ParentID"],['13','柜台','5']);
			insert('tb_ExamTypes',["ExamTypeID", "ExamTypeName", "ParentID"],['14','保险','5']);
			insert('tb_ExamTypes',["ExamTypeID", "ExamTypeName", "ParentID"],['15','理财','5']);
			insert('tb_ExamTypes',["ExamTypeID", "ExamTypeName", "ParentID"],['16','甲方','6']);
			insert('tb_ExamTypes',["ExamTypeID", "ExamTypeName", "ParentID"],['17','材料','6']);
			insert('tb_ExamTypes',["ExamTypeID", "ExamTypeName", "ParentID"],['18','核价','7']);
			insert('tb_ExamTypes',["ExamTypeID", "ExamTypeName", "ParentID"],['19','总价','7']);
			//试卷
			insert('tb_Papers',["PaperID", "ExamTypeID", "PaperTypeID", "TotalScore", "ItemNum", "UserCount","IsUpdate", "IsVip","IsDownLoad", "PassMark", "UpLoaderID", "TotalTime", "Year","ContainQuestionTypes","CreateTime","CreatorID","UpdateTime","UpdaterID","Dec"],['1','10','1','100','11','23','1','1','1','60','192.168','150','2016','1|3','2016.1.6','192.128','2016.1.2','192.102','数学试卷']);
			insert('tb_Papers',["PaperID", "ExamTypeID", "PaperTypeID", "TotalScore", "ItemNum", "UserCount","IsUpdate", "IsVip","IsDownLoad", "PassMark", "UpLoaderID", "TotalTime", "Year","ContainQuestionTypes","CreateTime","CreatorID","UpdateTime","UpdaterID","Dec"],['2','10','2','100','11','23','0','0','1','60','192.168','150','2016','1|3','2016.1.6','192.128','2016.1.2','192.102','爱上大声地']);
			insert('tb_Papers',["PaperID", "ExamTypeID", "PaperTypeID", "TotalScore", "ItemNum", "UserCount","IsUpdate", "IsVip","IsDownLoad", "PassMark", "UpLoaderID", "TotalTime", "Year","ContainQuestionTypes","CreateTime","CreatorID","UpdateTime","UpdaterID","Dec"],['3','10','2','100','11','23','0','0','0','60','192.168','150','2016','1|3','2016.1.6','192.128','2016.1.2','192.102','阿斯顿撒']);
			insert('tb_Papers',["PaperID", "ExamTypeID", "PaperTypeID", "TotalScore", "ItemNum", "UserCount","IsUpdate", "IsVip","IsDownLoad", "PassMark", "UpLoaderID", "TotalTime", "Year","ContainQuestionTypes","CreateTime","CreatorID","UpdateTime","UpdaterID","Dec"],['4','10','3','100','11','23','0','1','0','60','192.168','150','2016','1|3','2016.1.6','192.128','2016.1.2','192.102','三大房贷撒']);
			insert('tb_Papers',["PaperID", "ExamTypeID", "PaperTypeID", "TotalScore", "ItemNum", "UserCount","IsUpdate", "IsVip","IsDownLoad", "PassMark", "UpLoaderID", "TotalTime", "Year","ContainQuestionTypes","CreateTime","CreatorID","UpdateTime","UpdaterID","Dec"],['5','11','1','100','11','23','0','0','0','60','192.168','150','2016','1|3','2016.1.6','192.128','2016.1.2','192.102','三大房贷撒']);
			insert('tb_Papers',["PaperID", "ExamTypeID", "PaperTypeID", "TotalScore", "ItemNum", "UserCount","IsUpdate", "IsVip","IsDownLoad", "PassMark", "UpLoaderID", "TotalTime", "Year","ContainQuestionTypes","CreateTime","CreatorID","UpdateTime","UpdaterID","Dec"],['6','11','2','100','11','23','0','1','0','60','192.168','150','2016','1|3','2016.1.6','192.128','2016.1.2','192.102','的范德萨']);
			insert('tb_Papers',["PaperID", "ExamTypeID", "PaperTypeID", "TotalScore", "ItemNum", "UserCount","IsUpdate", "IsVip","IsDownLoad", "PassMark", "UpLoaderID", "TotalTime", "Year","ContainQuestionTypes","CreateTime","CreatorID","UpdateTime","UpdaterID","Dec"],['7','11','3','100','11','23','0','0','1','60','192.168','150','2016','1|3','2016.1.6','192.128','2016.1.2','192.102','资的范德萨格证']);
			insert('tb_Papers',["PaperID", "ExamTypeID", "PaperTypeID", "TotalScore", "ItemNum", "UserCount","IsUpdate", "IsVip","IsDownLoad", "PassMark", "UpLoaderID", "TotalTime", "Year","ContainQuestionTypes","CreateTime","CreatorID","UpdateTime","UpdaterID","Dec"],['8','11','1','100','11','23','0','1','0','60','192.168','150','2016','1|3','2016.1.6','192.128','2016.1.2','192.102','二恶我说的']);
			insert('tb_Papers',["PaperID", "ExamTypeID", "PaperTypeID", "TotalScore", "ItemNum", "UserCount","IsUpdate", "IsVip","IsDownLoad", "PassMark", "UpLoaderID", "TotalTime", "Year","ContainQuestionTypes","CreateTime","CreatorID","UpdateTime","UpdaterID","Dec"],['9','10','1','100','11','23','0','0','1','60','192.168','150','2016','1|3','2016.1.6','192.128','2016.1.2','192.102','我问问去啊']);
			insert('tb_Papers',["PaperID", "ExamTypeID", "PaperTypeID", "TotalScore", "ItemNum", "UserCount","IsUpdate", "IsVip","IsDownLoad", "PassMark", "UpLoaderID", "TotalTime", "Year","ContainQuestionTypes","CreateTime","CreatorID","UpdateTime","UpdaterID","Dec"],['10','12','1','100','11','23','0','0','0','60','192.168','150','2016','1|3','2016.1.6','192.128','2016.1.2','192.102','打发士大夫']);
			insert('tb_Papers',["PaperID", "ExamTypeID", "PaperTypeID", "TotalScore", "ItemNum", "UserCount","IsUpdate", "IsVip","IsDownLoad", "PassMark", "UpLoaderID", "TotalTime", "Year","ContainQuestionTypes","CreateTime","CreatorID","UpdateTime","UpdaterID","Dec"],['11','12','3','100','11','23','0','1','0','60','192.168','150','2016','1|3','2016.1.6','192.128','2016.1.2','192.102','是打发第三方']);
			insert('tb_Papers',["PaperID", "ExamTypeID", "PaperTypeID", "TotalScore", "ItemNum", "UserCount","IsUpdate", "IsVip","IsDownLoad", "PassMark", "UpLoaderID", "TotalTime", "Year","ContainQuestionTypes","CreateTime","CreatorID","UpdateTime","UpdaterID","Dec"],['12','12','3','100','11','23','0','0','0','60','192.168','150','2016','1|3','2016.1.6','192.128','2016.1.2','192.102','呈现出向周星驰']);
			insert('tb_Papers',["PaperID", "ExamTypeID", "PaperTypeID", "TotalScore", "ItemNum", "UserCount","IsUpdate", "IsVip","IsDownLoad", "PassMark", "UpLoaderID", "TotalTime", "Year","ContainQuestionTypes","CreateTime","CreatorID","UpdateTime","UpdaterID","Dec"],['13','12','2','100','11','23','0','0','1','60','192.168','150','2016','1|3','2016.1.6','192.128','2016.1.2','192.102','子现场走心辞职信']);
			insert('tb_Papers',["PaperID", "ExamTypeID", "PaperTypeID", "TotalScore", "ItemNum", "UserCount","IsUpdate", "IsVip","IsDownLoad", "PassMark", "UpLoaderID", "TotalTime", "Year","ContainQuestionTypes","CreateTime","CreatorID","UpdateTime","UpdaterID","Dec"],['14','13','1','100','11','23','0','0','0','60','192.168','150','2016','1|3','2016.1.6','192.128','2016.1.2','192.102','自行车自行车']);
			insert('tb_Papers',["PaperID", "ExamTypeID", "PaperTypeID", "TotalScore", "ItemNum", "UserCount","IsUpdate", "IsVip","IsDownLoad", "PassMark", "UpLoaderID", "TotalTime", "Year","ContainQuestionTypes","CreateTime","CreatorID","UpdateTime","UpdaterID","Dec"],['15','13','2','100','11','23','0','0','0','60','192.168','150','2016','1|3','2016.1.6','192.128','2016.1.2','192.102','自行车自行车在']);
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
	}]);