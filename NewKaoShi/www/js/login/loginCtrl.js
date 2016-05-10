loginModule
	.controller('NavigationCtrl', ['$scope', '$state', '$ionicSlideBoxDelegate',
		function($scope, $state, $ionicSlideBoxDelegate) {
			$scope.GoInit = GoInit;
			$scope.$on('$ionicView.enter', function() {
				$ionicSlideBoxDelegate.slide(0);
			})

			function GoInit() {
				$state.go('examType', {
					type: 0
				});
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
				$rootScope.isLogin = true;
				$state.go('tab.home')
			}
			//显示注册modal
			function goRegister() {
				$ionicModal.fromTemplateUrl('templates/login/registerModal.html', {
					scope: $scope,
					animation: 'slide-in-up'
				}).then(function(modal) {
					$scope.resmodal = modal;
					$scope.resmodal.show();
				});
			}
			//注册
			function Register() {
				$rootScope.isLogin = true;
				$scope.resmodal.hide();
				$state.go('tab.home')
			}
			//返回个人信息
			function BackAccount() {
				$state.go('tab.account')
			}

		}
	])