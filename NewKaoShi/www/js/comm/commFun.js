commModule
	.factory('CommFunServ', ['$timeout','LoaclStorageServ','$cordovaAppVersion','$q',
	function($timeout,LoaclStorageServ,$cordovaAppVersion,$q) {
		var server={
			CheckInit:CheckInit,
			RefreshData:RefreshData,
			InitArray:InitArray,
			GetValue:GetValue,
			GetKey:GetKey,
			GetValueIndex:GetValueIndex,
			GetKeyIndex:GetKeyIndex
		}
		return server;
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
				arr.push(jsondata[k]);
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
		
	}])
	.factory('LoaclStorageServ', ['$window', 
		function($window) {
			/*
			 * 说明：LocalStorage缓存服务
			 */
			return {
				set: function(key, value) {
					//添加缓存
					$window.localStorage[key] = value;
				},
				get: function(key, defaultValue) {
					//得到缓存
					return $window.localStorage[key] || defaultValue;
				},
				setObject: function(key, value) {
					//添加json格式缓存
					$window.localStorage[key] = angular.toJson(value);
				},
				getObject: function(key, defaultValue) {
					//得到json格式缓存
					return angular.fromJson($window.localStorage[key] || defaultValue);
				},
				getBoolean: function(key, defaultValue) {
					//添加bool缓存
					if ($window.localStorage[key] == "true") {
						return true;
					} else if ($window.localStorage[key] == "false") {
						return false;
					} else {
						return defaultValue;
					}
				},
				removeItem: function(key) {
					//得到bool缓存
					return $window.localStorage.removeItem(key);
				},
				clear: function() {
					//清除bool缓存
					return $window.localStorage.clear();
				}
			}
		}
	])