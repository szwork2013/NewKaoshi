loginModule
	.factory('LoginServ', ['DataServ', '$state','$rootScope','CommFunServ','$q',
		function(DataServ, $state,$rootScope,CommFunServ,$q) {
			var serverdata={
				registererr:''
			}
			var server = {
				InitAppData: InitAppData,//初始化数据库
				GoInit:GoInit,//从引导页进入应用
				Login:Login,//登录
				Register:Register
			}
			return server;

			function InitAppData() {
				DataServ.InitDataBase();
			}

			function GoInit() {
				//测试删除
				localStorage.removeItem("examTypeList");
				localStorage.removeItem("examTypeId");
				$rootScope.userInfo=localStorage.getItem("userInfo");
				var str = localStorage.getItem("examTypeList");
				var id= localStorage.getItem("examTypeId"); //当前进入分类id
				DataServ.PostExamTypes();
				if (str && id) {
					$rootScope.currentList = JSON.parse(str);
					$state.go('tab.home');
					$rootScope.examTypeID = id;
					DataServ.PostExamPaper(id);
				} else { //第一次进入
					$state.go('examType', {
						type: 0
					});
				}
				
			}
			function Login(name,pwd){
				DataServ.PostLogin(name,pwd).then(function(res){
					$rootScope.isLogin = true;
					$state.go('tab.home');
				},function(err){
					CommFunServ.ShowAlert('提示','登录失败,'+err)
				})
			}
			function Register(name,nickname,pwd,conpassword,email,isConfirm){
				if(name==null || name==''){
					serverdata.registererr='请填写邮箱';
					CommFunServ.RefreshData(serverdata);
					return;
				}
				if(nickname==null || nickname==''){
					serverdata.registererr='请填写昵称';
					CommFunServ.RefreshData(serverdata);
					return;
				}
				if(pwd!=conpassword){
					serverdata.registererr='确认密码与密码不符';
					CommFunServ.RefreshData(serverdata);
					return;
				}
				if(!isConfirm){
					serverdata.registererr='请阅读用户协议';
					CommFunServ.RefreshData(serverdata);
					return;
				}
				var q=$q.defer();
				DataServ.PostRegister(name,nickname,pwd,email).then(function(data){
					console.log(data)
					q.resolve(data);
					//设置userinfo
					//$rootScope.userInfo=
					//跳转页面
				},function(err){
					q.resolve(err)
				});
				return q.promise;
			}
		}
	])