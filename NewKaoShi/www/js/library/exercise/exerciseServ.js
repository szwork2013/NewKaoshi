libraryModule
	.factory('ExerciseServ', ['$rootScope', 'DataServ', 'CommFunServ', '$ionicSlideBoxDelegate', '$state',
		function($rootScope, DataServ, CommFunServ, $ionicSlideBoxDelegate, $state) {
			var currentType; //currentType=0试卷，currentType=1错题与收藏
			var currentIndex; //当前试题索引
			var serverdata = {
				isShowAnswer:false,//是否值显示解析，在考试答案解析用true
				isShowTitle: false, //是否显示大题标题
				titleContent: null, //当前大题内容
				title: '', //题型
				isUpload: false, //是否交卷
				showAnswer: false, //是否显示答案
				questiontitle: '', //题干
				btnStatus: 0//0答案解析，1收藏，2取消收藏

			}
			var server = {
				GetServerData: GetServerData,
				slideHasChanged: slideHasChanged, //改变试题
				InitList: InitList, //初始化
				SelectAnswer: SelectAnswer, //选择答案
				LastTest: LastTest, //上一题
				NextTest: NextTest, //下一题
				Back: Back, //返回
				ShowAnswer: ShowAnswer //显示答案

			}
			return server;

			function GetServerData() {
				return serverdata;
			}
			//初始化数据
			function InitList(obj) {
				currentType = obj.type;
				AssmbleRightAnswer();
				//bool=true有历史记录，type=0试卷，type=1错题与收藏，2考试答案解析
				if (currentType=='0') {
					if(obj.history == 'true'){
						GetHistory();
					}
					slideHasChanged(0);
				}else {
					var index = 0;
					if (obj.qKey && currentType=='2') {
						serverdata.isShowAnswer=true;
						var len = $rootScope.currentpaper.questionlist.length;
						for (var i = 0; i < len; i++) {
							if ($rootScope.currentpaper.questionlist[i].q_key == obj.qKey) {
								index = i;
								break;
							}
						}
					}
					SildeTo(index);
				}
			}

			function AssmbleRightAnswer() {
				var len = $rootScope.currentpaper.questionlist.length;
				for (var i = 0; i < len; i++) {
					var questiontype = $rootScope.currentpaper.questionlist[i].questionType
					if (questiontype == 'singleChoice' || questiontype == 'mutepliChoice' || questiontype == 'checking') {
						$rootScope.currentpaper.questionlist[i].rightAnswer = CommFunServ.InitArray($rootScope.currentpaper.questionlist[i].optionContent.length, false);
						var answerlist = $rootScope.currentpaper.questionlist[i].answer.split("");
						var length = answerlist.length;
						for (var j = 0; j < length; j++) {
							var index = 0;
							if (questiontype == 'checking') {
								index = CommFunServ.GetValueIndex($rootScope.currentpaper.questionlist[i].optionContent, answerlist[j]);
							} else {
								index = CommFunServ.GetKeyIndex($rootScope.currentpaper.questionlist[i].optionContent, answerlist[j]);
							}
							$rootScope.currentpaper.questionlist[i].rightAnswer[index] = true;
						}
					}

				}
			}
			//获取历史
			function GetHistory() {
				//type=1表示历史试卷练习
				DataServ.GetHistoy($rootScope.currentpaper.paperID,1).then(function(data) {
					if (data && data.length > 0) {
						//存在历史
						if ($rootScope.currentpaper.answerContent == null) {
							$rootScope.currentpaper.answerContent = new Array();
						}
						$rootScope.currentpaper.answerContent = eval("(" + data[0].Content + ")");
						AssmbleList();
					}
				})
			}
			//组装历史记录
			function AssmbleList() {
				var len = $rootScope.currentpaper.answerContent.length;
				for (var i = 0; i < len; i++) {
					var length = $rootScope.currentpaper.questionlist.length;
					for (var j = 0; j < length; j++) {
						if ($rootScope.currentpaper.answerContent[i].id == $rootScope.currentpaper.questionlist[j].id) {
							var questiontype=$rootScope.currentpaper.questionlist[j].questionType
							if (questiontype== 'singleChoice'||questiontype== 'mutepliChoice'||questiontype== 'checking') {
								//单选0，多选1
								var arr = $rootScope.currentpaper.answerContent[i].answer.split("");
								var lenk = arr.length;
								var list = CommFunServ.InitArray($rootScope.currentpaper.questionlist[j].optionContent.length,false);
								var sd = true;
								for (var k = 0; k < lenk; k++) {
									var index=0;
									if(questiontype== 'checking'){
										index=CommFunServ.GetValueIndex($rootScope.currentpaper.questionlist[j].optionContent,arr[k]);
									}else{
										index=CommFunServ.GetKeyIndex($rootScope.currentpaper.questionlist[j].optionContent,arr[k]);
									}
									if(index>=0){
										list[index] = true;
										
									}
								}
								$rootScope.currentpaper.questionlist[j].answerArr = list;
								$rootScope.currentpaper.questionlist[j].hasdo = sd;
								CommFunServ.RefreshData(serverdata);
							}
							//简答未实现
							break;
						}
					}
				}
				slideHasChanged(0);
			}
			//切换试题类型
			function slideHasChanged(index) {
				currentIndex=index;
				//根据大题类型显示头
				var item = $rootScope.currentpaper.questionlist[index];
				serverdata.showAnswer = item.hasdo;
				if(serverdata.showAnswer){
					serverdata.btnStatus=1;
				}
				if(index==0){
					serverdata.titleContent=null;
					serverdata.isShowTitle=true;
				}
				if(index>0){
					//与前一题对比查看是否显示大题
					var lastitem= $rootScope.currentpaper.questionlist[index-1];
					if(item.pq_key==lastitem.pq_key){
						serverdata.isShowTitle=false;
					}else{
						serverdata.titleContent=null;
						serverdata.isShowTitle=true;
					}
				}
				var len = $rootScope.currentpaper.questiontitle.length;
				for (var i = 0; i < len; i++) {
					if ($rootScope.currentpaper.questiontitle[i].q_key == item.pq_key) {
						AssmbleTitle(i);
						switch ($rootScope.currentpaper.questiontitle[i].questionType) {
							case 'checking':
								serverdata.title = "判断题";
								break;
							case 'singleChoice':
								serverdata.title = "单选题";
								break;
							case 'mutepliChoice':
								serverdata.title = "多选题";
								break;
							case '2':
								serverdata.title = "案例题";
								break;
							default:
								serverdata.title = "";
								break;
						}
						CommFunServ.RefreshData(serverdata);
						return;
					}
				}
			}
			
			//显示头标题
			function AssmbleTitle(index){
				var item=$rootScope.currentpaper.questiontitle[index];
				if(serverdata.titleContent==null){
					serverdata.titleContent=new Array();
				}
				if(serverdata.titleContent.indexOf(item)==-1){
					serverdata.titleContent.unshift(item);
				}
				if(item.questionIndex==0){
					var len=$rootScope.currentpaper.questiontitle.length;
					for(var i=0;i<len;i++){
						if(item.pq_key==$rootScope.currentpaper.questiontitle[i].q_key){
							AssmbleTitle(i);
							return;
						}
					}
				}
			}
			//单选
			function SelectAnswer(parentindex, index) {
				if(currentType == '2'){
					serverdata.btnStatus=1;
					return;
				}
				var item = $rootScope.currentpaper.questionlist[parentindex];
				/*if(item.answerArr && item.answerArr[index]){
					item.answerArr[index]=false;
					item.hasdo=false;
				}
				else*/ if (item.answerArr == null || item.questionType == 'singleChoice' || item.questionType == 'checking') {
					item.answerArr = CommFunServ.InitArray(item.optionContent.length + 1, false)
					if(index>=0){
						item.answerArr[index] = true;
						item.hasdo=true;
					}
				}
				serverdata.showAnswer = item.hasdo;
				if (serverdata.showAnswer) {
					serverdata.btnStatus = 1;
				}
				
				var arr = []
				var len = item.answerArr.length;
				for (var i = 0; i < len; i++) {
					if (item.answerArr[i]) {
						var value = '';
						if (item.questionType == 'checking') {
							var str = CommFunServ.GetValue(item.optionContent, i);
							value = str.substr(2, str.length - 1);
						} else {
							value = CommFunServ.GetKey(item.optionContent, i);
						}
						arr.push(value);
					}
				}
				var str = arr.join("");

				//答案是否存在，修改答案
				if ($rootScope.currentpaper.answerContent == null) {
					$rootScope.currentpaper.answerContent = new Array();
				}
				var length = $rootScope.currentpaper.answerContent.length;
				for (var j = 0; j < length; j++) {
					if ($rootScope.currentpaper.answerContent[j].id == item.ID) {
						$rootScope.currentpaper.answerContent[j].answer = str;
						CommFunServ.RefreshData(serverdata);
						return;
					}
				}
				//添加答案
				var answeritem = {
					id: item.id,
					answer: str
				}
				$rootScope.currentpaper.answerContent.push(answeritem);
				CommFunServ.RefreshData(serverdata);
			}
			function SildeTo(index){
				if(index<$ionicSlideBoxDelegate.slidesCount()){
					$ionicSlideBoxDelegate.slide(index)
				}
			}
			//上一题
			function LastTest() {
				if ($ionicSlideBoxDelegate.currentIndex() <= 0) {
					//已到最前题
					return;
				}
				$ionicSlideBoxDelegate.previous();
			}
			//下一题
			function NextTest() {
				var length = $rootScope.currentpaper.questionlist.length - 1;
				if ($ionicSlideBoxDelegate.currentIndex() >= length) {
					//已到最后题
					return;
				}
				$ionicSlideBoxDelegate.next();
				//记录历史(未完成)
			}

			function Back() {
				Destory();
				if (currentType == '0') {
					//保存历史
					var item = [{
						PaperID: $rootScope.currentpaper.paperID,
						UserID: '',
						Time: 0,
						Soure: 0,
						Content: JSON.stringify($rootScope.currentpaper.answerContent),
						Type: 1, //练习
						IsEnd: 0,
						IsSync: false
					}]
					DataServ.SaveHisData(item);
					//返回试卷详细
					$state.go('paperDetail');
				} else if(currentType == '1'){
					//返回错误列表
					$state.go('tab.error');
				}else{
					//返回答题卡
					$state.go('resultCard');
				}
			}
			//显示答案
			function ShowAnswer() {
				var item = $rootScope.currentpaper.questionlist[currentIndex];
				if (item.questionType== 'singleChoice'||item.questionType== 'mutepliChoice'||item.questionType== 'checking') { //单选，多选
					SelectAnswer(currentIndex);
					/*item.hasdo = true;
					serverdata.showAnswer=true;
					serverdata.btnStatus = 1;*/
				}

			}

			function Conllect(bool) {
				if (bool) {
					serverdata.btnStatus = 2;
				} else {
					serverdata.btnStatus = 1;
				}
			}
			function Destory(){
				serverdata.isShowAnswer=false;//是否值显示解析，在考试答案解析用true
				serverdata.isShowTitle=false; //是否显示大题标题
				serverdata.titleContent=null; //当前大题内容
				serverdata.title=''; //题型
				serverdata.isUpload=false; //是否交卷
				serverdata.showAnswer=false;//是否显示答案
				serverdata.questiontitle=''; //题干
				serverdata.btnStatus= 0;
			}
		}
	])