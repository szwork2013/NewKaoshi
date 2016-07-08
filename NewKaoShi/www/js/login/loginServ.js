loginModule
	.factory('LoginServ', ['DataServ', '$state', '$rootScope', 'CommFunServ', '$q','$ionicLoading',
		function(DataServ, $state, $rootScope, CommFunServ, $q,$ionicLoading) {
			var serverdata = {
				registererr: ''
			}
			var server = {
				InitAppData: InitAppData, //初始化数据库
				GoInit: GoInit, //从引导页进入应用
				Login: Login, //登录
				Register: Register
			}
			return server;

			function InitAppData() {
				DataServ.InitDataBase();
			}

			function GoInit() {
				//测试删除
				//localStorage.removeItem("examTypeList");
				//localStorage.removeItem("examTypeId");
				//localStorage.removeItem("userInfo");
				//创建目录
				CommFunServ.CreateDir();
				CommFunServ.InitData();

				$rootScope.userInfo = localStorage.getItem("userInfo");
				var str = localStorage.getItem("examTypeList");
				var id = localStorage.getItem("examTypeId"); //当前进入分类id
				Go();
				function Go() {
					if (str && id) {
						DataServ.PostExamTypes();
						$rootScope.currentList = JSON.parse(str);
						$state.go('tab.home');
						$rootScope.examTypeID = id;
						DataServ.PostExamPaper(id);
					} else { //第一次进入
						$ionicLoading.show({
							template: '加载中...'
						})
						DataServ.PostExamTypes().then(function(res) {
							$ionicLoading.hide(); //隐藏加载
							$state.go('examType', {
								type: 0
							});
						}, function(err) {});
					}
				}
			}

			function Login(name, pwd) {
				DataServ.PostLogin(name, pwd).then(function(res) {
					$rootScope.isLogin = true;
					localStorage.setItem("userInfo", JSON.stringify(res))
					$state.go('tab.home');
				}, function(err) {
					CommFunServ.ShowAlert('提示', '登录失败,' + err)
				})
			}

			function Register(name, nickname, pwd, conpassword, email, isConfirm) {
				var q = $q.defer();
				if (name == null || name == '') {
					serverdata.registererr = '请填写邮箱';
					CommFunServ.RefreshData(serverdata);
					return q.promise;
				}
				if (nickname == null || nickname == '') {
					serverdata.registererr = '请填写昵称';
					CommFunServ.RefreshData(serverdata);
					q.reject()
					return q.promise;
				}
				if (pwd != conpassword) {
					serverdata.registererr = '确认密码与密码不符';
					CommFunServ.RefreshData(serverdata);
					q.reject()
					return q.promise;
				}
				if (!isConfirm) {
					serverdata.registererr = '请阅读用户协议';
					CommFunServ.RefreshData(serverdata);
					q.reject()
					return q.promise;
				}
				DataServ.PostRegister(name, nickname, pwd, email).then(function(data) {
					CommFunServ.ShowAlert("提示", "注册成功!")
					q.resolve(data);
					//设置userinfo
					//$rootScope.userInfo=
					//跳转页面
				}, function(err) {
					serverdata.registererr = err;
					q.reject(err)
				});
				return q.promise;
			}
		}
	])