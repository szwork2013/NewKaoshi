classifyModule
	.factory('ExamTypeServ', ['$state', '$rootScope', 'CommFunServ', 'GetDataServ',
		function($state, $rootScope, CommFunServ, GetDataServ) {
			var examList = []
			$rootScope.currentList = {
				id: 0,
				name: '',
				children: [] //当前显示列表
			}
			var serverdata = {
				grandchildren: [] //当前列表子列表
			}
			var server = {
				BindServerData: BindServerData,
				InitList: InitList,
				ShowChildren: ShowChildren,
				ShowParent: ShowParent
			}
			return server;

			function BindServerData() {
				return serverdata;
			}

			function InitList() {
				GetDataServ.GetExamType().then(function(data) {
					examList = data;
					ShowChildren(0, '考试分类')
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
					$state.go('tab.home');
				} else {
					$rootScope.currentList.children = arr;
					serverdata.grandchildren = [];
					$rootScope.currentList.id = id;
					$rootScope.currentList.name = name;
				}
				CommFunServ.RefreshData(serverdata);
				if (id == 0) {
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
					if ($rootScope.currentList.id == 0) {
						Back();
						return;
					} else {
						var len = examList.length;
						for (var i = 0; i < len; i++) {
							if (examList[i].ExamTypeID == $rootScope.currentList.id) {
								if (examList[i].ParentID == 0) {
									ShowChildren(examList[i].ParentID, '考试分类');
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