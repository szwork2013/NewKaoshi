commModule
	.factory('CommFunServ', ['$timeout', '$q', '$rootScope','$cordovaFile','$cordovaFileTransfer','$ionicPopup',
		function($timeout, $q, $rootScope,$cordovaFile,$cordovaFileTransfer,$ionicPopup) {
			var server = {
				InitData: InitData,
				CheckInit: CheckInit,
				RefreshData: RefreshData,
				InitArray: InitArray,
				GetValue: GetValue,
				GetKey: GetKey,
				GetValueIndex: GetValueIndex,
				GetKeyIndex: GetKeyIndex,
				ShowConfirm: ShowConfirm, //确认框
				ShowAlert: ShowAlert,//提示框
				JsonSort:JsonSort,
				format: format,
				secondFormat: secondFormat,//设置时间格式
				
				CreateDir:CreateDir,//创建目录
				Download:Download//下载
				

			}
			return server;

			function InitData() {
				//当前试卷信息
				$rootScope.currentpaper = {
					paperID: 0, //当前试卷ID
					itemNum: 0, //总题数
					totalTime: 0, //总时间
					totalScore: 0, //总分数
					passMark: 0, //及格分数
					rtime: 0, //时间
					score: 0, //得分
					questionlist: [], //试题列表
					questiontitle: [], //标题列表
					answerContent: null //答案列表
				}
			}
			//刷新界面数据
			function RefreshData(data) {
				$timeout(function() {
					data = data;
				}, 0)
			}

			function InitArray(length, initdata) {
				var arr = new Array();
				for (var i = 0; i < length; i++) {
					arr[i] = initdata;
				}
				return arr;
			}
			//通过索引获取json对象中的值
			function GetValue(jsondata, index) {
				var arr = new Array();
				for (var k in jsondata) {
					arr.push(jsondata[k]);
				}
				var value = arr[index];
				return value;
			}
			//通过索引获取json对象中的值
			function GetKey(jsondata, index) {
				var arr = new Array();
				for (var k in jsondata) {
					arr.push(k);
				}
				var keyvalue = arr[index];
				return keyvalue;
			}
			//获取json对象中值索引
			function GetValueIndex(jsondata, value) {
				var arr = new Array();
				for (var k in jsondata) {
					var str = jsondata[k].substr(2, jsondata[k].length - 1)
					arr.push(str);
				}
				var index = arr.indexOf(value);
				return index;
			}
			//获取json对象中键索引
			function GetKeyIndex(jsondata, keyvalue) {
				var arr = new Array();
				for (var k in jsondata) {
					arr.push(k);
				}
				var index = arr.indexOf(keyvalue);
				return index;
			}
			//初始化检查
			function CheckInit() {
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
			function JsonSort(jsondata){
				var arr=new Array();
				if(jsondata){
					for(var item in jsondata){
						arr.push({key:item,value:jsondata[item]})
					}
				}
				
				return arr.sort();
			}
			//时间格式化
			function format(_date, format) {
				var o = {
					"M+": _date.getMonth() + 1, //month 
					"d+": _date.getDate(), //day 
					"h+": _date.getHours(), //hour 
					"m+": _date.getMinutes(), //minute 
					"s+": _date.getSeconds(), //second 
					"q+": Math.floor((_date.getMonth() + 3) / 3), //quarter 
					"S": _date.getMilliseconds() //millisecond 
				}

				if (/(y+)/.test(format)) {
					format = format.replace(RegExp.$1, (_date.getFullYear() + "").substr(4 - RegExp.$1.length));
				}

				for (var k in o) {
					if (new RegExp("(" + k + ")").test(format)) {
						format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
					}
				}
				format = format.substring(0, format.length - 3);
				return format;
			};
			//时间格式化
			function secondFormat(_date, format) {
				var o = {
					"M+": _date.getMonth() + 1, //month 
					"d+": _date.getDate(), //day 
					"h+": _date.getHours(), //hour 
					"m+": _date.getMinutes(), //minute 
					"s+": _date.getSeconds(), //second 
					"q+": Math.floor((_date.getMonth() + 3) / 3), //quarter 
					"S": _date.getMilliseconds() //millisecond 
				}

				if (/(y+)/.test(format)) {
					format = format.replace(RegExp.$1, (_date.getFullYear() + "").substr(4 - RegExp.$1.length));
				}

				for (var k in o) {
					if (new RegExp("(" + k + ")").test(format)) {
						format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
					}
				}
				//format = format.substring(0,format.length-3);
				return format;
			};
			function CreateDir() {
				$cordovaFile.getFreeDiskSpace()
					.then(function(success) {
						$cordovaFile.checkDir(cordova.file.externalRootDirectory, "KaoHaoDian")
							.then(function(success) {

							}, function(error) {
								$cordovaFile.createDir(cordova.file.externalRootDirectory, "KaoHaoDian", false)
									.then(function(success) {
										// success
									}, function(error) {
										ShowAlert("提示", "文件创建失败,清理内存重试");
									});
							});
					}, function(error) {
						ShowAlert("提示", "无内存空间")
					});
			}

			function Download(url) {
				var q = $q.defer();
				if (!CheckPlatform()) {
					var fileName = "";
					if (url.indexOf("=") == -1) {
						var filesurl = url.split('/');
						fileName = filesurl[filesurl.length - 1];
					} else {
						var filesurl = url.split('=');
						fileName = filesurl[filesurl.length - 1];
					}
					var targetPath = cordova.file.externalRootDirectory + "KaoHaoDian/" + fileName;
					var trustHosts = true;
					var options = {};
					$cordovaFile.checkFile(cordova.file.externalRootDirectory + "KaoHaoDian/", fileName)
						.then(function(success) {
							q.resolve(success)
						}, function(error) {
							$cordovaFileTransfer.download(url, targetPath, options, trustHosts)
								.then(function(result) {
									q.resolve(result);
								}, function(err) {
									q.reject(err);
								}, function(progress) {
									downloadProgress = (progress.loaded / progress.total) * 100;
									q.resolve(downloadProgress);
								});
						});
				}

				return q.promise;
			}

		}
	])