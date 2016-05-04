libraryModule
	.factory('KaoshiServ', ['$timeout', '$rootScope', 'GetDataServ',
		function($timeout, $rootScope, GetDataServ) {
			var timeCount; //秒
			var timer; //setTimeout方法 
			var serverdata = {
				rtime: 0, //考试时间
				questionlist: [], //考试试题
				isUpload: false, //是否交卷
				answerContent:[]//试卷所有试题答案
				
			}
			var server = {
				GetServerData:GetServerData
			}
			return server;

			function GetServerData() {
				return serverdata;
			}
			//获取试卷试题
			function GeTQuestionList(bool) {
				if ($rootScope.currentPaper) {
					if ($rootScope.currentPaper.IsDownload == 0) {
						//试卷未下载，请求下载试题
					} else {
						//获取试卷所有试题并合并
						GetDataServ.GetQuestionData($rootScope.currentPaper.PaperID).then(function(data) {
							if (data && data.length > 0) {
								serverdata.questionlist=data;
								//type=0表示历史考试
								if(bool){
									GetHistory(data);
								}
							}
						})
					}
				}
			}
			//获取历史
			function GetHistory(datalist) {
				GetDataServ.GetHistoyPaper($rootScope.currentPaper.PaperID, 0).then(data) {
					if (data && data.length > 0) {
						//存在历史
						serverdata.answerContent=data[0].Content;
						AssmbleList();
					}
				}
			}
			//组装历史记录
			function AssmbleList(){
				var len=serverdata.answerContent.length;
				for(var i=0;i<len;i++){
					var length=serverdata.questionlist.length;
					for(var j=0;j<length;j++){
						if(serverdata.answerContent[i].id==serverdata.questionlist[j].ID){
							//"1|3"多选答案
							if(serverdata.questionlist[j].QuestionType!=2 ){
								//单选0，多选1
								var arr=serverdata.answerContent[i].answer.split("|");
								var lenk=arr.length;
								var list=new Array(serverdata.questionlist[j].OptionContent.length;);
								for(var k=0;k<lenk;k++){
									list[arr[k]]=true;
								}
								serverdata.questionlist[j].answer=list;
							}
							break;
						}
					}
				}
			}
			//试题id，选项索引index，当前题已做选项
			function GetCurrentAnswer(id,index){
				if(serverdata.answerContent){
					
				}
				return false;
			}
			//单选
			function SelectAnswer(parentindex,index) {
				var item=serverdata.questionlist[parentindex];
				var answeritem={
					id:item.ID,
					answer:index
				}
				serverdata.answerContent.push(answeritem);
				NextTest();
			}
			//初始化考试时间秒、分、小时
			function InitTime(sec) {
				timeCount = sec;
				StartTime();
			}
			//开始及时
			function StartTime() {
				t = $timeout(function() {
					time++;
					ShowTime(time);
				}, 1000); //每隔1秒（1000毫秒）递归调用一次
			}
			//停止考试
			function StopTime() {
				if (t) {
					$timeout.cancel(t);
					t = null;
				}
			}
			//显示时间
			function ShowTime(time) {
				var hour = time / 3600;
				var minute = time % 3600 / 60;
				var second = time % 60;
				var str = AssmbleTime(hour) + ":" + AssmbleTime(minute) + ":" + AssmbleTime(second);
			}
			//显示数字填补，即当显示的值为0-9时
			function AssmbleTime(arg) {
				return arg >= 10 ? arg : "0" + arg;
			}
		}
	])