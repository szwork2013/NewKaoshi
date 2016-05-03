commModule
	.factory('CommFunServ', ['$timeout','LoaclStorageServ','$cordovaAppVersion','$q',
	function($timeout,LoaclStorageServ,$cordovaAppVersion,$q) {
		var server={
			CheckInit:CheckInit,
			RefreshData:RefreshData
		}
		return server;
		//刷新界面数据
		function RefreshData(data){
			$timeout(function(){
				data=data;
			},0)
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