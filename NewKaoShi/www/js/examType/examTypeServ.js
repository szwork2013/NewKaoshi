classifyModule
	.factory('ExamTypeServ', ['$state', '$rootScope', 'CommFunServ', 'GetDataServ',
		function($state, $rootScope, CommFunServ, GetDataServ) {
			var examList = []
			var serverdata = {
				currentList: {
					id: 0,
					name: '',
					children: []
				},
				grandchildren: []
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
				serverdata.currentList = {
					id: 0,
					name: '',
					children: []
				}
				serverdata.grandchildren = [];
				serverdata.currentList.id = id;
				serverdata.currentList.name = name;
				var len = examList.length;
				for (var i = 0; i < len; i++) {
					if (examList[i].ParentID == id) {
						serverdata.currentList.children.push(examList[i]);
					}
				}
				if (serverdata.currentList.children.length <= 0) {
					$rootScope.examTypeID = id;
					$state.go('tab.home');
				}
				CommFunServ.RefreshData(serverdata);
				if (id == 0) {
					ShowGrandChildren();
				}
			}

			function ShowGrandChildren() {
				var len = serverdata.currentList.children.length;
				for (var i = 0; i < len; i++) {
					var item = {
						parentid: serverdata.currentList.children[i].ExamTypeID,
						childernlist: []
					}
					var alllen = examList.length;
					for (var j = 0; j < alllen; j++) {
						if (examList[j].ParentID == serverdata.currentList.children[i].ExamTypeID) {
							item.childernlist.push(examList[j]);
						}
					}
					serverdata.grandchildren.push(item);
					CommFunServ.RefreshData(serverdata);
				}
			}
			//显示父级，子级id
			function ShowParent() {
				if (serverdata.currentList) {
					if (serverdata.currentList.id == 0) {
						Back();
						return;
					} else {
						var len = examList.length;
						for (var i = 0; i < len; i++) {
							if (examList[i].ExamTypeID == serverdata.currentList.id) {
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
			function Destory(){
				
			}
		}
	])