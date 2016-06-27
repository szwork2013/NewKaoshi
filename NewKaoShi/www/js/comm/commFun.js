commModule
	.factory('CommFunServ', ['$timeout','$cordovaAppVersion','$q','$rootScope',
	function($timeout,$cordovaAppVersion,$q,$rootScope) {
		var server={
			InitData:InitData,
			CheckInit:CheckInit,
			RefreshData:RefreshData,
			InitArray:InitArray,
			GetValue:GetValue,
			GetKey:GetKey,
			GetValueIndex:GetValueIndex,
			GetKeyIndex:GetKeyIndex,
			ShowConfirm:ShowConfirm,//确认框
			ShowAlert:ShowAlert//提示框
			
		}
		return server;
		function InitData(){
			//当前试卷信息
			$rootScope.currentpaper={
				paperID:0,//当前试卷ID
				itemNum:0,//总题数
				totalTime:0,//总时间
				totalScore:0,//总分数
				passMark:0,//及格分数
				rtime:0,//时间
				score:0,//得分
				questionlist:[],//试题列表
				questiontitle:[],//标题列表
				answerContent:null//答案列表
			}
		}
		//刷新界面数据
		function RefreshData(data){
			$timeout(function(){
				data=data;
			},0)
		}
		function InitArray(length, initdata) {
			var arr = new Array();
			for (var i = 0; i < length; i++) {
				arr[i] = initdata;
			}
			return arr;
		}
		//通过索引获取json对象中的值
		function GetValue(jsondata,index){
			var arr=new Array();
			for(var k in jsondata){
				arr.push(jsondata[k]);
			}
			var value=arr[index];
			return value;
		}
		//通过索引获取json对象中的值
		function GetKey(jsondata,index){
			var arr=new Array();
			for(var k in jsondata){
				arr.push(k);
			}
			var keyvalue=arr[index];
			return keyvalue;
		}
		//获取json对象中值索引
		function GetValueIndex(jsondata,value){
			var arr=new Array();
			for(var k in jsondata){
				var str=jsondata[k];
				arr.push(str);
			}
			var index=arr.indexOf(value);
			return index;
		}
		//获取json对象中键索引
		function GetKeyIndex(jsondata,keyvalue){
			var arr=new Array();
			for(var k in jsondata){
				arr.push(k);
			}
			var index=arr.indexOf(keyvalue);
			return index;
		}
		//初始化检查
		function CheckInit(){
			/*var q=$q.defer();
			var oldversion=LoaclStorageServ.get('version',null)
			$cordovaAppVersion.getVersionNumber().then(function (version) {
       			var appVersion = version;
       			if(oldversion==null || oldversion!=appVersion){
       				q.resolve(true);
       			}else{
       				q.resolve(false);
       			}
      		});
      		return q.promise;*/
		}
		//  confirm 对话框
			function ShowConfirm(title, content) {
				var q = $q.defer();
				var confirmPopup = $ionicPopup.confirm({
					title: title,
					template: content
				});
				confirmPopup.then(function(res) {
					q.resolve(res)
					confirmPopup.close();
				});
				return q.promise;
			};
			//alert警告框
			function ShowAlert(title, content) {
				var q = $q.defer();
				var alertPopup = $ionicPopup.alert({
					title: title,
					template: content
				});
				alertPopup.then(function(res) {
					q.resolve(res)
					alertPopup.close();
				});
				return q.promise;
			}
		
	}])