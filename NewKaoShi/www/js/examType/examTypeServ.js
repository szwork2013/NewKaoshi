classifyModule
	.factory('ExamTypeServ', ['$state', '$rootScope', 'CommFunServ', 'DataServ',
		function($state, $rootScope, CommFunServ, DataServ) {
			var examList = []
			$rootScope.currentList = {
				id: 0,//当前列表父id
				name: '',//当前列表父名
				children: [] //当前显示列表
			}
			var serverdata = {
				grandchildren: [] //当前列表子列表
			}
			var server = {
				GetServerData: GetServerData,//绑定数据
				InitList: InitList,//初始化列表
				ShowChildren: ShowChildren,//显示子列表
				ShowParent: ShowParent//返回显示父列表
			}
			return server;

			function GetServerData() {
				return serverdata;
			}

			function InitList() {
				DataServ.BaseSelect( "select * from tb_ExamTypes").then(function(data) {
					examList = data;
					ShowChildren(null, '考试分类')
				})
			}
			//显示下级,父级id，父级name
			function ShowChildren(id, name) {
				var arr = [];
				var len = examList.length;
				for (var i = 0; i < len; i++) {
					if (examList[i].ParentID == id) {
						arr.push(examList[i]);
					}
				}
				if (arr.length <= 0) {
					$rootScope.examTypeID = id; //当前进入分类id
					DataServ.PostExamPaper(id);
					$state.go('tab.home');
				} else {
					$rootScope.currentList.children = arr;
					serverdata.grandchildren = [];
					$rootScope.currentList.id = id;
					$rootScope.currentList.name = name;
				}
				CommFunServ.RefreshData(serverdata);
				if (id == null) {
					ShowGrandChildren();
				}
			}

			function ShowGrandChildren() {
				var len = $rootScope.currentList.children.length;
				for (var i = 0; i < len; i++) {
					var item = {
						parentid: $rootScope.currentList.children[i].ExamTypeID,
						childernlist: []
					}
					var alllen = examList.length;
					for (var j = 0; j < alllen; j++) {
						if (examList[j].ParentID == $rootScope.currentList.children[i].ExamTypeID) {
							item.childernlist.push(examList[j]);
						}
					}
					serverdata.grandchildren.push(item);
					CommFunServ.RefreshData(serverdata);
				}
			}
			//显示父级，子级id
			function ShowParent() {
				if ($rootScope.currentList) {
					if ($rootScope.currentList.id == null) {//当前列表已是基层考试类型，
						Back();
						return;
					} else {
						var len = examList.length;
						for (var i = 0; i < len; i++) {
							if (examList[i].ExamTypeID == $rootScope.currentList.id) {
								if (examList[i].ParentID == null) {//
									ShowChildren(examList[i].ParentID, '考试分类');
									return;
								} else {
									for (var j = 0; j < len; j++) {
										if (examList[i].ParentID == examList[j].ExamTypeID) {
											ShowChildren(examList[j].ExamTypeID, examList[j].ExamTypeName);
											return;
										}
									}
								}
							}
						}
					}
				}
				CommFunServ.RefreshData(serverdata);
			}
			//返回
			function Back() {
				$state.go('tab.library');
			}

			function Destory() {

			}
		}
	])