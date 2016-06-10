loginModule
	.controller('NavigationCtrl', ['$scope', '$ionicSlideBoxDelegate', 'LoginServ',
		function($scope, $ionicSlideBoxDelegate, LoginServ) {
			$scope.GoInit = GoInit; //点击进入
			$scope.$on('$ionicView.enter', function() {
				$ionicSlideBoxDelegate.slide(0);
				LoginServ.InitAppData();
			})

			function GoInit() {
				LoginServ.GoInit();
			}
		}
	])
	.controller('LoginCtrl', ['$scope', '$rootScope', 'LoginServ', '$state', '$ionicModal',
		function($scope, $rootScope, LoginServ, $state, $ionicModal) {
			$scope.goRegister = goRegister;
			$scope.Login = Login;
			$scope.BackAccount = BackAccount;
			$scope.Register = Register;

			//登陆
			function Login() {
				//请求登陆，未完成
				var name = $scope.loginData.account;
				var pwd = $scope.loginData.password;
				LoginServ.Login(name, pwd);
				$rootScope.isLogin = true;
				//
			}
			//显示注册modal
			function goRegister() {
				if ($scope.resmodal==null) {

					$ionicModal.fromTemplateUrl('templates/login/registerModal.html', {
						scope: $scope,
						animation: 'slide-in-up'
					}).then(function(modal) {
						$scope.resmodal = modal;
						$scope.resmodal.show();
					});
				} else {
					$scope.resmodal.show();
				}
			}
			//注册
			function Register() {
				
				if($scope.resmodal){
					$scope.resmodal.hide();
				}
				var name = $scope.loginData.account;
				var nickname= $scope.loginData.name;
				var pwd = $scope.loginData.password;
				var conpassword = $scope.loginData.conpassword;
				var email = $scope.loginData.account;
				var isConfirm=$scope.loginData.confim;
				LoginServ.Register(name,nickname,pwd,conpassword,email,isConfirm);
			}
			//返回个人信息
			function BackAccount() {
				$state.go('tab.account')
			}

		}
	])