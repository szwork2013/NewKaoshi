errorModule
	.factory('ErrorServ', ['DataServ', 'CommFunServ', '$q','$state','$rootScope',
		function(DataServ, CommFunServ, $q,$state,$rootScope) {
			var serverdata = {
				paperlist: null

			}
			var server = {
				GetServerdata: GetServerdata,
				InitData: InitData,
				ChangeShowItem:ChangeShowItem,
				TestAgain:TestAgain,
				Destory: Destory
			}
			return server;

			function GetServerdata() {
				return serverdata;
			}

			function InitData() {
				//获取错题
				DataServ.GetErrorData().then(function(errordata) {
					if (errordata && errordata.length > 0) {
						AssmblePaperList(errordata)
					}
					//获取收藏
					DataServ.GetCollectData().then(function(data) {
						if (data && data.length > 0) {
							AssmblePaperList(data)
						}
						GetExamName();
					})
				})
			}
			//组装显示数据
			function AssmblePaperList(data) {
				if (serverdata.paperlist == null) {
					serverdata.paperlist = new Array();
				}
				var len = data.length;
				for (var i = 0; i < len; i++) {
					var listitem = JugeExamId(data[i].ExamTypeID, data[i].Type)
					if (listitem != null) {
						var item = {
							paperID: data[i].PaperID,
							paperName: data[i].PaperContent,
							count: data[i].rows
						}
						if (listitem.errorlist == null) {
							listitem.errorlist = new Array();
						}
						listitem.errorlist.push(item);
						item = null;
					} else {
						var examitem = {
							listtype: data[i].Type, //错题id: 1, //错题id
							examTypeID: data[i].ExamTypeID,
							examTypeName: '',
							isShow: false,
							errorlist: [{
								paperID: data[i].PaperID,
								paperName: data[i].PaperContent,
								count: data[i].rows
							}]
						}
						serverdata.paperlist.push(examitem);

						examitem = null;
					}
				}
				CommFunServ.RefreshData(serverdata);
			}
			//判断是否有考试类型
			function JugeExamId(examtypeid, type) {
				if (serverdata.paperlist) {
					var len = serverdata.paperlist.length;
					for (var i = 0; i < len; i++) {
						if (examtypeid == serverdata.paperlist[i].examTypeID) {
							if (type == serverdata.paperlist[i].listtype) {
								return serverdata.paperlist[i];
							} else {
								return null;
							}
						}
					}
				}
				return null;
			}
			//获取考试类型名
			function GetExamName() {
				DataServ.GetExamName().then(function(data) {
						if (data && data.length > 0) {
							var len = serverdata.paperlist.length;
							var length = data.length;
							for (var i = 0; i < len; i++) {
								for (var j = 0; j < length; j++) {
									if (serverdata.paperlist[i].examTypeID == data[j].ExamTypeID) {
										serverdata.paperlist[i].examTypeName = data[j].ExamTypeName;
										continue;
									}
								}
							}
						}
						CommFunServ.RefreshData(serverdata);
				})
			}
			function ChangeShowItem(index){
				serverdata.paperlist[index].isShow=!serverdata.paperlist[index].isShow;
				CommFunServ.RefreshData(serverdata);
			}
			function TestAgain(paperid,type){
				$rootScope.currentpaper.questionlist = []; //试题列表
				$rootScope.currentpaper.questiontitle = []; //标题列表
				//组装试题(未完成)
				DataServ.GetQuestionData(paperid,type).then(function(data){
					if(data && data.length>0){
						var len=data.length;
						for(var i=0;i<len;i++){
							data[i].optionContent = eval("(" + data[i].optionContent + ")");
						//组装选项
						for (var key in data[i].optionContent) {
							//组装答案（img未完成）
							data[i].optionContent[key] = key + "." + data[i].optionContent[key];
						}
						//组装题干(img未完成)
						data[i].questionContent = data[i].c_key + '.' + data[i].questionContent;
							$rootScope.currentpaper.questionlist.push(data[i]);
						}
					}
					Destory();
					$state.go('exercise',{
						history:false,
						type:1
					})
					
				})
				//跳转到exercise
			}
			//销毁
			function Destory() {
				serverdata.paperlist = null;
			}
		}
	])