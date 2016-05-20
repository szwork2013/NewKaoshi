errorModule
	.factory('ErrorServ', ['DataServ', 'CommFunServ','$q',
		function(DataServ, CommFunServ,$q) {
			var serverdata = {
				paperlist: null

			}
			var server = {
				GetServerdata: GetServerdata,
				InitData: InitData,
				Destory:Destory
			}
			return server;

			function GetServerdata() {
				return serverdata;
			}

			function InitData() {
				serverdata.paperlist=null;
				//获取错题
				DataServ.GetErrorData().then(function(errordata) {
						if (errordata && errordata.length > 0) {
							AssmblePaperList(errordata)
						}
					})
					//获取收藏
				DataServ.GetCollectData().then(function(data) {
					if (data && data.length > 0) {
						AssmblePaperList(data)
					}
				})
			}
			//组装显示数据
			function AssmblePaperList( data) {
				if (serverdata.paperlist == null) {
					serverdata.paperlist = new Array();
				}
				var len = data.length;
				for (var i = 0; i < len; i++) {
					var listitem = JugeExamId(data[i].ExamTypeID,data[i].Type)
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
						GetExamName();
						examitem=null;
					}
				}
				CommFunServ.RefreshData(serverdata);
			}
			//判断是否有考试类型
			function JugeExamId(examtypeid,type) {
				if (serverdata.paperlist) {
					var len = serverdata.paperlist.length;
					for (var i = 0;i<len; i++) {
						if (examtypeid == serverdata.paperlist[i].examTypeID) {
							if(type==serverdata.paperlist[i].listtype){
								return serverdata.paperlist[i];
							}else{
								return null;
							}
						}
					}
				}
				return null;
			}
			//获取考试类型名
			function GetExamName(){
				var len=serverdata.paperlist.length;
				for(var i=0;i<len;i++){
					if(serverdata.paperlist[i].examTypeName=''){
						DataServ.GetExamName(serverdata.paperlist[i].examTypeID).then(function(data){
							if(data && data.length>0){
								serverdata.paperlist[i].examTypeName=data[0].ExamTypeName;
							}
						})
					}
				}
			}
			//销毁
			function Destory(){
				serverdata.paperlist=null;
			}
		}
	])