loginModule
	.controller('InitCtrl', ['$scope', '$state', '$ionicSlideBoxDelegate',
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
	.controller('LoginCtrl', ['$scope', '$rootScope', 'LoginServ', '$state',
		function($scope, $rootScope, LoginServ, $state) {
			$scope.goRegister = goRegister;
			$scope.Login = Login;
			$scope.BackAccount = BackAccount;

			function goRegister() {
				$state.go('register');
			}

			function Login() {
				$rootScope.isLogin = true;
				$state.go('tab.home')
			}

			function BackAccount() {
				$state.go('tab.account')
			}
		}
	])