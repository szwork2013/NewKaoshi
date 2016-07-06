libraryModule
	.factory('PaperDetailServ', ['$state', '$rootScope', 'DataServ', '$ionicLoading', '$timeout', 'CommFunServ', '$q',

		function($state, $rootScope, DataServ, $ionicLoading, $timeout, CommFunServ, $q) {
			var serverdata = {
				paperdetail: null, //试卷详情
				haveExercise: false, //是否有练习历史
				haveKaoshi: false, //是否有考试历史
				isEnd: false //考试是否交卷
			}
			var server = {
				GetServerData: GetServerData,
				InitData: InitData,
				Start: Start,
				BackLibrary: BackLibrary
			}
			return server;

			function GetServerData() {
				return serverdata;
			}
			//初始化试卷详情
			function InitData() {
				//获取试卷详情
				DataServ.GetPaperData($rootScope.currentpaper.paperID).then(function(data) {
					if (data && data.length > 0) {
						serverdata.paperdetail = data[0];
						//获取历史，已下载的试卷才会出现历史记录
						if (serverdata.paperdetail.IsDownload != 0) {
							CheckHistory();
						}

					}
				})
			}
			//检查历史记录
			function CheckHistory() {
				DataServ.GetHistoy($rootScope.currentpaper.paperID).then(function(data) {
					serverdata.haveKaoshi = false;
					serverdata.haveExercise = false;
					serverdata.isEnd = false;
					if (data && data.length > 0) {
						var len = data.length;
						for (var i = 0; i < len; i++) {
							if (data[i].Type == 0) { //存在考试记录
								serverdata.haveKaoshi = true;
								if (data[i].IsEnd == 1) {
									serverdata.isEnd = true;
								}
								$rootScope.currentpaper.rtime = data[i].Time;
							} else if (data[i].Type == 1) { //存在练习记录
								serverdata.haveExercise = true;
							}
						}
					}
				})
			}
			//开始考试、练习
			function Start(type) {
				//试卷内容有更新
				if ($rootScope.currentpaper && $rootScope.currentpaper.status == "3") {
					PostPaperQuestion(type);
				} else {
					//获取试卷所有试题
					DataServ.GetPaperQuestions($rootScope.currentpaper.paperID).then(function(data) {

						if (data && data.length > 0) {
							//组装试题数据
							AssmbleQuestionData(data, type);
						} else { //数据库无数据
							PostPaperQuestion(type);
						}
					})
				}
			}

			function PostPaperQuestion(type) {
				//显示加载
				$ionicLoading.show({
						template: '加载试题中...'
					})
					//请求服务器数据
				DataServ.PostQuestions($rootScope.currentpaper.paperID).then(function(data) {
					$ionicLoading.hide(); //隐藏加载
					if (data && data.length > 0) {

						//存储数据库
						DataServ.SaveQuestion(data);
						//CommFunServ.Download()
						//DataServ.PostQuestionPic("0f5ac1d4c612408ab9cbb4912f3be38d")
						//组装试题数据
						AssmbleQuestionData(data, type);
						//修改试卷状态
						DataServ.UpdatePaperStatus(data[0].paperId);

					} else {
						CommFunServ.ShowAlert("提示", "试题下载失败!")
							//提示加载失败(未完成)
					}
				}, function(err) {
					$ionicLoading.hide(); //隐藏加载
					CommFunServ.ShowAlert('提示', '加载试题失败!')
				});
			}
			//组装试题数据
			function AssmbleQuestionData(data, type) {
				var len = data.length;
				$rootScope.currentpaper.questionlist = []; //试题列表
				$rootScope.currentpaper.questiontitle = []; //标题列表
				$rootScope.currentpaper.answerContent = null; //答案列表
				for (var i = 0; i < len; i++) {
					data[i].questionContent = AssmblePicUrl(data[i].id,data[i].questionContent,"questionContent")
					if (data[i].answer != null && data[i].answer != '') {
						//组装图片
						data[i].optionContent = AssmblePicUrl(data[i].id,data[i].optionContent,"optionContent");
						data[i].optionContent = JSON.parse(data[i].optionContent); //eval("(" + + ")");
						data[i].answer = AssmblePicUrl(data[i].id,data[i].answer,"answer");
						data[i].analysis = AssmblePicUrl(data[i].id,data[i].analysis,"analysis");
						//组装选项
						$rootScope.currentpaper.questionlist.push(data[i]);
					} else {
						$rootScope.currentpaper.questiontitle.push(data[i]);
					}
				}
				//跳转到试题
				GoExam(type);		
			}
			//返回题库
			function BackLibrary() {
				$state.go('tab.library');
			}
			//跳转到试题
			function GoExam(type) {
				if (type == 0) {
					if (serverdata.isEnd) { //上一次考试已确认交卷
						$state.go('result')
					} else {
						$state.go('kaoshi', {
							history: serverdata.haveKaoshi
						})
					}
				} else {
					$state.go('exercise', {
						history: serverdata.haveExercise,
						type: 0
					})
				}
			}

			function AssmblePicUrl(id,data,type) {
				if (data) {
					var str = data.match(/{:\w*}/g);
					if (str) {
						if()
						var url = DataServ.GetBaseUrl();
						for (var k in str) {
							var replacestr = url + 'getQuestionPic.do?placeId=' + str[k].substr(2, str[k].length - 3);
							var replacea = str[k];
							var img = "<img ng-src='" + replacestr + "' src='" + replacestr + "'/>";
							data = data.replace(replacea, img);
						}
					}
				}
				return data;
			}
			function DownLoad() {
				CommFunServ.Download(url).then(function(adata) {
					if (adata && typeof(adata) != 'string') {
						replacestr = adata.nativeURL;
						img = "<img ng-src='" + replacestr + "' src='" + replacestr + "'/>";
						data = data.replace(replacea, img);
						q.resolve(data);
					}
				}, function(err) {
					data = data.replace(replacea, img);
					q.resolve(data);
				});
			}
		}
	])